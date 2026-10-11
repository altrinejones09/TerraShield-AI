import type { ApiGatewayEvent, LambdaResponse } from '../types';
import { CORS_HEADERS } from '../auth';
import { db } from '../db';

export async function healthHandler(event: ApiGatewayEvent): Promise<LambdaResponse> {
  const body = {
    status: 'healthy',
    service: 'TerraShield AI Backend',
    version: '1.4.0',
    timestamp: new Date().toISOString(),
    storage: {
      type: db.getStorageType(),
      status: db.getStorageType() === 'DynamoDB' ? 'connected' : 'demo_mode',
    },
    auth: {
      provider: process.env.COGNITO_USER_POOL_ID ? 'Amazon Cognito' : 'LocalDemoAuth',
      status: 'active',
    },
    iot: {
      protocol: 'MQTT / AWS IoT Core',
      status: 'hardware_offline_standby',
    },
  };

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}
