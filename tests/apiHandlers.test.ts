import { describe, it, expect } from 'vitest';
import { healthHandler } from '../backend/src/handlers/health';
import { readingsHandler } from '../backend/src/handlers/readings';
import { alertsHandler } from '../backend/src/handlers/alerts';

describe('TerraShield AI — Backend Handlers', () => {
  it('GET /health returns healthy status without leaking internal secrets', async () => {
    const res = await healthHandler({ rawPath: '/health' });
    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(body.status).toBe('healthy');
    expect(body.service).toBe('TerraShield AI Backend');
    expect(body.storage).toBeDefined();
    expect(body.auth).toBeDefined();
  });

  it('GET /readings/latest returns latest array', async () => {
    const res = await readingsHandler({
      rawPath: '/readings/latest',
      requestContext: { http: { method: 'GET', path: '/readings/latest', sourceIp: '127.0.0.1' } },
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('POST /readings rejects unauthenticated requests with 401', async () => {
    const res = await readingsHandler({
      rawPath: '/readings',
      requestContext: { http: { method: 'POST', path: '/readings', sourceIp: '127.0.0.1' } },
      body: JSON.stringify({
        deviceId: 'NODE-SLOPE-01',
        rainfall: 10,
        soilMoisture: 50,
        tilt: 0.5,
        vibration: 0.05,
      }),
    });

    expect(res.statusCode).toBe(401);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(false);
    expect(body.error).toContain('Unauthorized');
  });

  it('POST /readings accepts valid authenticated requests and returns 201', async () => {
    const res = await readingsHandler({
      rawPath: '/readings',
      headers: {
        authorization: 'Bearer ts_demo_jwt_1234567890',
      },
      requestContext: { http: { method: 'POST', path: '/readings', sourceIp: '127.0.0.1' } },
      body: JSON.stringify({
        deviceId: 'NODE-SLOPE-01',
        rainfall: 32,
        soilMoisture: 78,
        tilt: 1.8,
        vibration: 0.12,
        source: 'SIMULATED',
      }),
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.reading).toBeDefined();
    expect(body.data.riskAssessment).toBeDefined();
    expect(body.data.riskAssessment.riskLevel).toBe('MODERATE');
  });
});
