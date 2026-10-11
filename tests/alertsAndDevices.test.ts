import { describe, it, expect } from 'vitest';
import { calculateDeviceStatus } from '../src/lib/sensorValidation';
import { apiClient } from '../src/lib/apiClient';

describe('TerraShield AI — Devices and Alert Workflows', () => {
  it('correctly calculates device status based on heartbeat latency', () => {
    const now = Date.now();
    const fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString();
    const fortyMinutesAgo = new Date(now - 40 * 60 * 1000).toISOString();
    const threeHoursAgo = new Date(now - 180 * 60 * 1000).toISOString();

    expect(calculateDeviceStatus(fiveMinutesAgo, now)).toBe('ONLINE');
    expect(calculateDeviceStatus(fortyMinutesAgo, now)).toBe('STALE');
    expect(calculateDeviceStatus(threeHoursAgo, now)).toBe('OFFLINE');
    expect(calculateDeviceStatus('invalid-date', now)).toBe('OFFLINE');
  });

  it('posts a high-hazard reading and creates a corresponding alert', async () => {
    const res = await apiClient.postReading({
      deviceId: 'NODE-SLOPE-01',
      rainfall: 55.0, // High trigger
      soilMoisture: 88.0, // High trigger
      tilt: 3.9, // High trigger
      vibration: 0.15,
      source: 'SIMULATED',
    });

    expect(res.reading.riskLevel).toBe('HIGH');
    expect(res.assessment.riskLevel).toBe('HIGH');
    expect(res.alert).toBeDefined();
    expect(res.alert?.severity).toBe('CRITICAL');
  });

  it('acknowledges an alert and records audit trail details', async () => {
    const alerts = await apiClient.getAlerts();
    expect(alerts.length).toBeGreaterThan(0);

    const targetAlert = alerts[0];
    const acked = await apiClient.acknowledgeAlert(targetAlert.id, {
      acknowledgedBy: 'Chief Geotechnical Officer',
      actionTaken: 'Field drone deployed for aerial slope inspection.',
    });

    expect(acked.acknowledged).toBe(true);
    expect(acked.acknowledgedBy).toBe('Chief Geotechnical Officer');
    expect(acked.actionTaken).toContain('Field drone deployed');
  });
});
