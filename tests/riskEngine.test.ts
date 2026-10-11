import { describe, it, expect } from 'vitest';
import { evaluateRisk, DEFAULT_THRESHOLDS } from '../src/lib/riskEngine';

describe('TerraShield AI — Geotechnical Risk Engine', () => {
  it('correctly classifies benign environmental baseline as LOW risk', () => {
    const baselineReading = {
      deviceId: 'NODE-SLOPE-01',
      rainfall: 4.5,
      rainfall24h: 18.0,
      soilMoisture: 42.0,
      tilt: 0.2,
      vibration: 0.04,
    };

    const result = evaluateRisk(baselineReading);
    expect(result.riskLevel).toBe('LOW');
    expect(result.thresholdsCrossed.length).toBe(0);
    expect(result.overallScore).toBeLessThan(45);
    expect(result.reason).toContain('normal baseline tolerances');
  });

  it('triggers MODERATE risk when soil moisture breaches moderate saturation threshold', () => {
    const elevatedReading = {
      deviceId: 'NODE-SLOPE-02',
      rainfall: 14.0,
      rainfall24h: 85.0, // Breaches 80mm
      soilMoisture: 75.0, // Breaches 72%
      tilt: 0.5,
      vibration: 0.08,
    };

    const result = evaluateRisk(elevatedReading);
    expect(result.riskLevel).toBe('MODERATE');
    expect(result.thresholdsCrossed.length).toBeGreaterThan(0);
    expect(result.reason).toContain('MODERATE RISK');
  });

  it('triggers HIGH risk when inclinometer tilt breaches active shear creep threshold (3.5°)', () => {
    const activeCreepReading = {
      deviceId: 'NODE-SLOPE-01',
      rainfall: 15.0,
      rainfall24h: 40.0,
      soilMoisture: 65.0,
      tilt: 3.85, // Breaches 3.5° high threshold
      vibration: 0.12,
    };

    const result = evaluateRisk(activeCreepReading);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.factors.tiltScore).toBe(100);
    expect(result.thresholdsCrossed.some(t => t.metric === 'tilt' && t.severity === 'HIGH')).toBe(true);
    expect(result.reason).toContain('HIGH HAZARD');
  });

  it('triggers HIGH risk when peak rainfall exceeds 45 mm/h deluge threshold', () => {
    const delugeReading = {
      deviceId: 'NODE-SLOPE-01',
      rainfall: 52.0, // Breaches 45 mm/h
      rainfall24h: 120.0,
      soilMoisture: 60.0,
      tilt: 0.4,
      vibration: 0.05,
    };

    const result = evaluateRisk(delugeReading);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.thresholdsCrossed.some(t => t.metric === 'rainfallRate' && t.severity === 'HIGH')).toBe(true);
  });

  it('correctly respects custom user thresholds', () => {
    const customThresholds = {
      ...DEFAULT_THRESHOLDS,
      rainfallRateHigh: 20.0, // Strict threshold
    };

    const result = evaluateRisk({ rainfall: 22.0 }, customThresholds);
    expect(result.riskLevel).toBe('HIGH');
  });
});
