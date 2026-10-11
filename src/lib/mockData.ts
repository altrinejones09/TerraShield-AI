/**
 * TerraShield AI — Deterministic Realistic Demonstration Telemetry
 * All data points generated here are VISIBLY LABELED as 'SIMULATED' demo records.
 */

import type { Device, SensorReading, Alert, RiskAssessment } from '../types/telemetry';
import { evaluateRisk } from './riskEngine';

export const INITIAL_DEVICES: Device[] = [
  {
    deviceId: 'NODE-SLOPE-01',
    name: 'Nilgiri Escarpment Node 1',
    locationLabel: 'Western Ghats, Sector 4A (KM 42 Ghat Road)',
    latitude: 11.4102,
    longitude: 76.6950,
    elevation: 1850,
    slopeAngle: 42,
    soilType: 'Lateritic clay over weathered gneiss',
    configuredSensors: ['rainfall', 'soilMoisture', 'tilt', 'vibration', 'temperature', 'humidity'],
    status: 'ONLINE',
    lastSeen: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    source: 'SIMULATED',
    firmwareVersion: 'v2.4.1-esp32-freertos',
    healthScore: 98,
    notes: 'High-risk steep road cut prone to monsoon slumps. Anchored to bedrock collar.',
  },
  {
    deviceId: 'NODE-SLOPE-02',
    name: 'Chamoli Debris Fan Node 2',
    locationLabel: 'Himalayan Ridge, Upper Alaknanda Valley',
    latitude: 30.4150,
    longitude: 79.3300,
    elevation: 2420,
    slopeAngle: 48,
    soilType: 'Glacial till & loose colluvium',
    configuredSensors: ['rainfall', 'soilMoisture', 'tilt', 'vibration', 'temperature'],
    status: 'ONLINE',
    lastSeen: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    source: 'SIMULATED',
    firmwareVersion: 'v2.4.1-esp32-freertos',
    healthScore: 94,
    notes: 'Periglacial debris sector; monitored for freeze-thaw expansion and extreme rainfall triggers.',
  },
  {
    deviceId: 'NODE-SLOPE-03',
    name: 'Cascade Ridge Node 3',
    locationLabel: 'Highway 20 Slope, Pacific Northwest',
    latitude: 48.5126,
    longitude: -121.4429,
    elevation: 1120,
    slopeAngle: 36,
    soilType: 'Volcanic andesite debris / pumice sand',
    configuredSensors: ['rainfall', 'soilMoisture', 'tilt', 'vibration'],
    status: 'STALE',
    lastSeen: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    source: 'SIMULATED',
    firmwareVersion: 'v2.3.9-esp32-freertos',
    healthScore: 78,
    notes: 'Solar array partially obscured by canopy. Cellular transmission packet delay observed.',
  },
  {
    deviceId: 'NODE-SLOPE-04',
    name: 'Fraser Cutting Node 4',
    locationLabel: 'Titiwangsa Range, Sector 12',
    latitude: 3.7118,
    longitude: 101.7394,
    elevation: 1450,
    slopeAngle: 39,
    soilType: 'Deeply weathered saprolite / residual silt',
    configuredSensors: ['rainfall', 'soilMoisture', 'tilt', 'vibration', 'temperature', 'humidity'],
    status: 'OFFLINE',
    lastSeen: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    source: 'SIMULATED',
    firmwareVersion: 'v2.2.0-esp32-freertos',
    healthScore: 45,
    notes: 'Offline for maintenance schedule or battery depletion. Replacement telemetry planned.',
  },
];

/**
 * Generate 24 hours of deterministic historical readings for a device.
 */
export function generateDeterministicHistory(deviceId: string, count = 36): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  const intervalMs = (24 * 60 * 60 * 1000) / count;

  // Parameters tuned per device
  const isHighRiskDevice = deviceId === 'NODE-SLOPE-01';
  const isModerateRiskDevice = deviceId === 'NODE-SLOPE-02';

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * intervalMs).toISOString();
    // Simulate a monsoon storm curve peaking around step 24-30
    const progress = (count - 1 - i) / count; // 0 to 1
    const stormPeak = Math.exp(-Math.pow((progress - 0.75) / 0.18, 2));

    let rainfall = 2 + stormPeak * (isHighRiskDevice ? 52 : isModerateRiskDevice ? 32 : 12);
    let soilMoisture = 45 + progress * (isHighRiskDevice ? 42 : isModerateRiskDevice ? 30 : 15);
    soilMoisture = Math.min(94, soilMoisture);
    let tilt = 0.2 + (progress > 0.6 ? (progress - 0.6) * (isHighRiskDevice ? 8.5 : 2.5) : 0);
    let vibration = 0.05 + stormPeak * (isHighRiskDevice ? 0.45 : 0.15);
    const rainfall24h = Math.round((rainfall * 3.5) + (progress * 85));

    // Round values
    rainfall = parseFloat(rainfall.toFixed(1));
    soilMoisture = parseFloat(soilMoisture.toFixed(1));
    tilt = parseFloat(tilt.toFixed(2));
    vibration = parseFloat(vibration.toFixed(3));

    const evalResult = evaluateRisk({
      deviceId,
      rainfall,
      rainfall24h,
      soilMoisture,
      tilt,
      vibration,
    });

    readings.push({
      id: `SIM-READ-${deviceId}-${count - i}`,
      deviceId,
      timestamp,
      rainfall,
      rainfall24h,
      soilMoisture,
      tilt,
      tiltPitch: parseFloat((tilt * 0.72).toFixed(2)),
      tiltRoll: parseFloat((tilt * 0.69).toFixed(2)),
      vibration,
      temperature: parseFloat((22.5 - progress * 4.2).toFixed(1)),
      humidity: Math.min(98, parseFloat((65 + progress * 30).toFixed(1))),
      batteryLevel: Math.max(70, Math.round(100 - progress * 12)),
      signalStrength: -65 - Math.round(Math.random() * 8),
      source: 'SIMULATED',
      dataMode: 'DEMO',
      riskLevel: evalResult.riskLevel,
      assessmentReason: evalResult.reason,
      isImplausible: false,
    });
  }

  return readings;
}

export const INITIAL_READINGS: SensorReading[] = [
  ...generateDeterministicHistory('NODE-SLOPE-01', 36),
  ...generateDeterministicHistory('NODE-SLOPE-02', 36),
  ...generateDeterministicHistory('NODE-SLOPE-03', 24),
  ...generateDeterministicHistory('NODE-SLOPE-04', 16),
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-SIM-001',
    deviceId: 'NODE-SLOPE-01',
    deviceName: 'Nilgiri Escarpment Node 1',
    location: 'Western Ghats, Sector 4A (KM 42 Ghat Road)',
    severity: 'CRITICAL',
    riskLevel: 'HIGH',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    title: 'High Hazard Slope Instability Breach',
    message: 'Continuous rainfall rate of 48.2 mm/h coupled with soil moisture saturation at 87.5% and 3.82° active tilt displacement.',
    contributingFactors: [
      'Peak Rainfall: 48.2 mm/h (Threshold: 45 mm/h)',
      'Soil Saturation: 87.5% VWC (Threshold: 85%)',
      'Ground Inclinometer Deflection: 3.82° (Threshold: 3.5°)',
    ],
    acknowledged: false,
    source: 'SIMULATED',
  },
  {
    id: 'ALT-SIM-002',
    deviceId: 'NODE-SLOPE-02',
    deviceName: 'Chamoli Debris Fan Node 2',
    location: 'Himalayan Ridge, Upper Alaknanda Valley',
    severity: 'WARNING',
    riskLevel: 'MODERATE',
    timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    title: 'Moderate Hydrological Saturation Watch',
    message: 'Cumulative 24h precipitation reached 98.4 mm with volumetric soil moisture exceeding 76.2%. Shear plane pore pressure elevated.',
    contributingFactors: [
      'Cumulative 24h Rain: 98.4 mm (Threshold: 80 mm)',
      'Soil Moisture: 76.2% VWC (Threshold: 72%)',
    ],
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    acknowledgedBy: 'Dr. Sarah Chen (Chief Geologist)',
    actionTaken: 'Field geologists alerted. Visual crack pins inspected at upper road shoulder.',
    source: 'SIMULATED',
  },
  {
    id: 'ALT-SIM-003',
    deviceId: 'NODE-SLOPE-03',
    deviceName: 'Cascade Ridge Node 3',
    location: 'Highway 20 Slope, Pacific Northwest',
    severity: 'ADVISORY',
    riskLevel: 'MODERATE',
    timestamp: new Date(Date.now() - 190 * 60 * 1000).toISOString(),
    title: 'Telemetry Telecommunication Latency Warning',
    message: 'Node heartbeat delayed past 30-minute threshold. Solar charge depleted under sustained cloud cover.',
    contributingFactors: ['Telemetry Heartbeat Stale (>45 min)'],
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    acknowledgedBy: 'Operations Dispatch',
    actionTaken: 'Cellular network tower checked; scheduled solar panel lens cleaning.',
    source: 'SIMULATED',
  },
];
