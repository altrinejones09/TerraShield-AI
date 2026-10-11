import type { ApiGatewayEvent, LambdaResponse } from '../types';
import { CORS_HEADERS, extractAuthContext } from '../auth';
import { db } from '../db';

export async function alertsHandler(event: ApiGatewayEvent): Promise<LambdaResponse> {
  const method = event.requestContext?.http?.method || 'GET';
  const path = event.rawPath || '';

  try {
    // 1. GET /alerts
    if (method === 'GET') {
      const severity = event.queryStringParameters?.severity;
      const ackStr = event.queryStringParameters?.acknowledged;
      const acknowledged = ackStr !== undefined ? ackStr === 'true' : undefined;

      const data = await db.getAlerts(severity, acknowledged);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, data, count: data.length }),
      };
    }

    // 2. POST /alerts/{id}/acknowledge
    if (method === 'POST' && path.includes('/acknowledge')) {
      const auth = extractAuthContext(event);
      if (!auth.isAuthenticated) {
        return {
          statusCode: 401,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: 'Unauthorized: Valid analyst credentials required.' }),
        };
      }

      // Extract alert ID from pathParameters or path
      let alertId = event.pathParameters?.id;
      if (!alertId) {
        const parts = path.split('/');
        const ackIndex = parts.indexOf('acknowledge');
        if (ackIndex > 0) {
          alertId = parts[ackIndex - 1];
        }
      }

      if (!alertId) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: 'Missing alert ID parameter in path.' }),
        };
      }

      let parsedBody: any = {};
      try {
        if (event.body) {
          parsedBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        }
      } catch {
        // use defaults
      }

      const ackBy = parsedBody.acknowledgedBy || auth.email || 'Duty Analyst';
      const actionTaken = parsedBody.actionTaken || 'Operator verified and confirmed geotechnical telemetry.';

      const updatedAlert = await db.acknowledgeAlert(alertId, ackBy, actionTaken);
      if (!updatedAlert) {
        return {
          statusCode: 404,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: `Alert with ID "${alertId}" not found.` }),
        };
      }

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, data: updatedAlert }),
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
