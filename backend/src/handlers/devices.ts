import type { ApiGatewayEvent, LambdaResponse } from '../types';
import { CORS_HEADERS, extractAuthContext } from '../auth';
import { db } from '../db';
import { validateDevicePayload } from '../validation';

export async function devicesHandler(event: ApiGatewayEvent): Promise<LambdaResponse> {
  const method = event.requestContext?.http?.method || 'GET';
  const path = event.rawPath || '';

  try {
    // 1. GET /devices/{id}
    const deviceIdParam = event.pathParameters?.id || (path.split('/devices/')[1] ? path.split('/devices/')[1].split('/')[0] : null);
    if (method === 'GET' && deviceIdParam) {
      const device = await db.getDevice(deviceIdParam);
      if (!device) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: `Device ${deviceIdParam} not found.` }),
        };
      }
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, data: device }),
      };
    }

    // 2. GET /devices
    if (method === 'GET') {
      const devices = await db.getDevices();
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, data: devices }),
      };
    }

    // 3. POST /devices
    if (method === 'POST') {
      const auth = extractAuthContext(event);
      if (!auth.isAuthenticated) {
        return {
          statusCode: 401,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: 'Unauthorized: Analyst credentials required.' }),
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

      const validation = validateDevicePayload(parsedBody);
      if (!validation.isValid) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, errors: validation.errors }),
        };
      }

      const existing = await db.getDevice(parsedBody.deviceId);
      if (existing) {
        return {
          statusCode: 409,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: `Device with ID ${parsedBody.deviceId} already exists.` }),
        };
      }

      const newDevice = {
        deviceId: parsedBody.deviceId.trim().toUpperCase(),
        name: parsedBody.name.trim(),
        locationLabel: parsedBody.locationLabel.trim(),
        latitude: Number(parsedBody.latitude) || 0,
        longitude: Number(parsedBody.longitude) || 0,
        elevation: Number(parsedBody.elevation) || 0,
        slopeAngle: Number(parsedBody.slopeAngle) || 40,
        soilType: parsedBody.soilType || 'Laterite Colluvium',
        configuredSensors: parsedBody.configuredSensors || ['rainfall', 'soilMoisture', 'tilt', 'vibration'],
        status: 'ONLINE',
        lastSeen: new Date().toISOString(),
        source: 'SIMULATED',
        firmwareVersion: 'v2.4.1-esp32-freertos',
        healthScore: 100,
      };

      await db.putDevice(newDevice);

      return {
        statusCode: 201,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, data: newDevice }),
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
