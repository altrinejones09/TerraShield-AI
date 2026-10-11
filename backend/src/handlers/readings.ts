import type { ApiGatewayEvent, LambdaResponse, SanitizedReading } from '../types';
import { CORS_HEADERS, extractAuthContext } from '../auth';
import { db } from '../db';
import { validateReadingPayload } from '../validation';
import { evaluateBackendRisk } from '../riskEngine';

export async function readingsHandler(event: ApiGatewayEvent): Promise<LambdaResponse> {
  const method = event.requestContext?.http?.method || 'GET';
  const path = event.rawPath || '';

  try {
    // 1. GET /readings/latest
    if (method === 'GET' && path.endsWith('/latest')) {
      const deviceId = event.queryStringParameters?.deviceId;
      const data = await db.getLatestReadings(deviceId);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, data }),
      };
    }

    // 2. GET /readings/history
    if (method === 'GET' && (path.endsWith('/history') || path.endsWith('/readings'))) {
      const deviceId = event.queryStringParameters?.deviceId;
      const limit = event.queryStringParameters?.limit
        ? parseInt(event.queryStringParameters.limit, 10)
        : 60;
      const riskLevel = event.queryStringParameters?.riskLevel;

      const data = await db.getReadingsHistory({ deviceId, limit, riskLevel });
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, data, count: data.length }),
      };
    }

    // 3. POST /readings
    if (method === 'POST') {
      const auth = extractAuthContext(event);
      if (!auth.isAuthenticated) {
        return {
          statusCode: 401,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: 'Unauthorized: Missing or invalid authentication token.' }),
        };
      }

      let parsedBody: any;
      try {
        parsedBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } catch {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: 'Invalid JSON request body.' }),
        };
      }

      const validation = validateReadingPayload(parsedBody);
      if (!validation.isValid || !validation.sanitized) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, errors: validation.errors }),
        };
      }

      const clean = validation.sanitized;
      const riskResult = evaluateBackendRisk(clean);

      const timestamp = clean.customTimestamp || new Date().toISOString();
      const newReading: SanitizedReading = {
        id: `READ-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        deviceId: clean.deviceId,
        timestamp,
        rainfall: clean.rainfall,
        rainfall24h: clean.rainfall24h,
        soilMoisture: clean.soilMoisture,
        tilt: clean.tilt,
        tiltPitch: clean.tiltPitch,
        tiltRoll: clean.tiltRoll,
        vibration: clean.vibration,
        temperature: clean.temperature,
        humidity: clean.humidity,
        source: clean.source,
        dataMode: 'DEMO',
        riskLevel: riskResult.riskLevel,
        assessmentReason: riskResult.reason,
      };

      await db.putReading(newReading);

      // Create alert if high or moderate threshold triggered
      let alertCreated: any = null;
      if (riskResult.riskLevel === 'HIGH' || riskResult.riskLevel === 'MODERATE') {
        const dev = await db.getDevice(clean.deviceId);
        alertCreated = {
          id: `ALT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          deviceId: clean.deviceId,
          deviceName: dev?.name || clean.deviceId,
          location: dev?.locationLabel || 'Monitored Sector',
          severity: riskResult.riskLevel === 'HIGH' ? 'CRITICAL' : 'WARNING',
          riskLevel: riskResult.riskLevel,
          timestamp,
          title:
            riskResult.riskLevel === 'HIGH'
              ? 'Critical Slope Instability Breach'
              : 'Hydrological Saturation Warning',
          message: riskResult.reason,
          contributingFactors: riskResult.thresholdsCrossed.map(
            t => `${t.label}: ${t.value}${t.unit} (Threshold: ${t.threshold}${t.unit})`
          ),
          acknowledged: false,
          source: clean.source,
        };
        await db.putAlert(alertCreated);
      }

      return {
        statusCode: 201,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          data: {
            reading: newReading,
            riskAssessment: riskResult,
            alert: alertCreated,
          },
        }),
      };
    }

    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: `Route not found: ${method} ${path}` }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
    };
  }
}
