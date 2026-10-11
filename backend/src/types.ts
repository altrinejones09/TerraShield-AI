/**
 * TerraShield AI — Backend Types & Event Interfaces
 */

export interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface ApiGatewayEvent {
  routeKey?: string;
  rawPath: string;
  rawQueryString?: string;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  pathParameters?: Record<string, string | undefined>;
  body?: string;
  isBase64Encoded?: boolean;
  requestContext?: {
    http?: {
      method: string;
      path: string;
      sourceIp: string;
    };
    authorizer?: {
      jwt?: {
        claims: {
          sub: string;
          email?: string;
          'cognito:groups'?: string[];
        };
      };
    };
  };
}

export interface SanitizedReading {
  id: string;
  deviceId: string;
  timestamp: string;
  rainfall: number;
  rainfall24h: number;
  soilMoisture: number;
  tilt: number;
  tiltPitch?: number;
  tiltRoll?: number;
  vibration: number;
  temperature: number;
  humidity: number;
  batteryLevel?: number;
  signalStrength?: number;
  source: 'SIMULATED' | 'HARDWARE';
  dataMode: 'DEMO' | 'PRODUCTION';
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  assessmentReason: string;
  isImplausible?: boolean;
  implausibleReason?: string;
}
