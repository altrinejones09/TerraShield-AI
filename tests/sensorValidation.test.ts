import { describe, it, expect } from 'vitest';
import { validateSensorInput } from '../src/lib/sensorValidation';

describe('TerraShield AI — Sensor Input Validation & Plausibility', () => {
  it('validates and sanitizes a complete, normal sensor reading', () => {
    const input = {
      deviceId: 'NODE-SLOPE-01',
      rainfall: 12.4,
      soilMoisture: 62.5,
      tilt: 0.8,
      vibration: 0.05,
    };

    const res = validateSensorInput(input);
    expect(res.isValid).toBe(true);
    expect(res.errors.length).toBe(0);
    expect(res.isImplausible).toBe(false);
    expect(res.sanitizedReading?.deviceId).toBe('NODE-SLOPE-01');
    expect(res.sanitizedReading?.rainfall).toBe(12.4);
  });

  it('rejects missing or empty deviceId', () => {
    const input = {
      deviceId: '   ',
      rainfall: 10,
      soilMoisture: 50,
      tilt: 1,
      vibration: 0.1,
    };

    const res = validateSensorInput(input);
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => e.includes('Device ID'))).toBe(true);
  });

  it('rejects negative rainfall and out-of-range soil moisture', () => {
    const input = {
      deviceId: 'NODE-SLOPE-01',
      rainfall: -5,
      soilMoisture: 108,
      tilt: 1,
      vibration: 0.1,
    };

    const res = validateSensorInput(input);
    expect(res.isValid).toBe(false);
    expect(res.errors.some(e => e.includes('non-negative'))).toBe(true);
    expect(res.errors.some(e => e.includes('between 0% and 100%'))).toBe(true);
  });

  it('flags extreme rainfall rate as implausible meteorological anomaly', () => {
    const input = {
      deviceId: 'NODE-SLOPE-01',
      rainfall: 395, // Above physical 350 mm/h threshold
      soilMoisture: 80,
      tilt: 1,
      vibration: 0.1,
    };

    const res = validateSensorInput(input);
    expect(res.isValid).toBe(true);
    expect(res.isImplausible).toBe(true);
    expect(res.implausibleReason).toContain('exceeds physical meteorological maximum');
  });

  it('flags extreme tilt as implausible/dislodged sensor condition', () => {
    const input = {
      deviceId: 'NODE-SLOPE-01',
      rainfall: 10,
      soilMoisture: 50,
      tilt: 75, // Above 60°
      vibration: 0.1,
    };

    const res = validateSensorInput(input);
    expect(res.isValid).toBe(true);
    expect(res.isImplausible).toBe(true);
    expect(res.implausibleReason).toContain('dislodged sensor fixture');
  });
});
