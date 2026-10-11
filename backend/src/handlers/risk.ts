import type { ApiGatewayEvent, LambdaResponse } from '../types';
import { CORS_HEADERS } from '../auth';
import { db } from '../db';
import { evaluateBackendRisk } from '../riskEngine';

export async function riskHandler(event: ApiGatewayEvent): Promise<LambdaResponse> {
  const method = event.requestContext?.http?.method || 'GET';
  const path = event.rawPath || '';

  try {
    // 1. GET /risk/current
    if (method === 'GET' && path.endsWith('/current')) {
      const deviceId = event.queryStringParameters?.deviceId;
      const readings = await db.getLatestReadings(deviceId);

      const assessments = readings.map(r => {
        const evalResult = evaluateBackendRisk(r);
        return {
          id: `RSK-${r.deviceId}-${Date.now()}`,
          deviceId: r.deviceId,
          timestamp: r.timestamp,
          riskLevel: evalResult.riskLevel,
          overallScore: evalResult.overallScore,
          reason: evalResult.reason,
          factors: evalResult.factors,
          thresholdsCrossed: evalResult.thresholdsCrossed,
          engineVersion: evalResult.engineVersion,
          recommendedAction: evalResult.recommendedAction,
        };
      });

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, data: assessments }),
      };
    }

    // 2. GET /risk/history
    if (method === 'GET' && path.endsWith('/history')) {
      const deviceId = event.queryStringParameters?.deviceId;
      const limit = event.queryStringParameters?.limit
        ? parseInt(event.queryStringParameters.limit, 10)
        : 30;

      const readings = await db.getReadingsHistory({ deviceId, limit });
      const assessments = readings.map((r, i) => {
        const evalResult = evaluateBackendRisk(r);
        return {
          id: `RSK-HIST-${r.deviceId}-${i}`,
          deviceId: r.deviceId,
          timestamp: r.timestamp,
          riskLevel: evalResult.riskLevel,
          overallScore: evalResult.overallScore,
          reason: evalResult.reason,
          factors: evalResult.factors,
          thresholdsCrossed: evalResult.thresholdsCrossed,
        };
      });

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, data: assessments }),
      };
    }

    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: 'Route not found' }),
    };
  } catch {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
    };
  }
}
