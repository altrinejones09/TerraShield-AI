export * from './telemetry';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    timestamp: string;
    environment: 'LOCAL_MOCK' | 'LOCAL_EXPRESS' | 'AWS_CLOUD';
  };
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'down';
  service: 'TerraShield AI Backend';
  version: string;
  timestamp: string;
  storage: {
    type: 'DynamoDB' | 'InMemoryStore';
    status: 'connected' | 'demo_mode';
  };
  auth: {
    provider: 'Amazon Cognito' | 'LocalDemoAuth';
    status: 'active';
  };
  iot: {
    protocol: 'MQTT / AWS IoT Core';
    status: 'hardware_offline_standby';
  };
}
