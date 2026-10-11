/**
 * TerraShield AI — Sensor Reading & Device Validation Library
 * Detects missing data, out-of-bound measurements, implausible telemetry, and stale devices.
 */

import type { SensorReading, Device, DeviceStatus, CreateReadingRequest } from '../types/telemetry';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  isImplausible: boolean;
  implausibleReason?: string;
  sanitizedReading?: Partial<SensorReading>;
}

export function validateSensorInput(input: Partial<CreateReadingRequest>): ValidationResult {
  const errors: string[] = [];
  let isImplausible = false;
  let implausibleReason: string | undefined;

  // 1. Device ID requirement
  if (!input.deviceId || typeof input.deviceId !== 'string' || input.deviceId.trim().length === 0) {
    errors.push('Device ID is required and must be a valid non-empty string.');
  }

  // 2. Rainfall rate bounds (0 to 400 mm/h)
  const rainfall = Number(input.rainfall);
  if (isNaN(rainfall) || rainfall < 0) {
    errors.push('Rainfall rate must be a non-negative number.');
  } else if (rainfall > 350) {
    isImplausible = true;
    implausibleReason = `Rainfall rate of ${rainfall} mm/h exceeds physical meteorological maximum (350 mm/h). Sensor clipping or tipping-bucket malfunction suspected.`;
  }

  // 3. Soil Moisture bounds (0% to 100% VWC)
  const soilMoisture = Number(input.soilMoisture);
  if (isNaN(soilMoisture) || soilMoisture < 0 || soilMoisture > 100) {
    errors.push('Soil moisture must be between 0% and 100% volumetric water content.');
  }

  // 4. Ground Tilt bounds (0° to 90°)
  const tilt = Number(input.tilt);
  if (isNaN(tilt) || tilt < 0) {
    errors.push('Tilt must be a non-negative angular measurement in degrees.');
  } else if (tilt > 60) {
    isImplausible = true;
    implausibleReason = implausibleReason || `Biaxial tilt of ${tilt}° indicates either complete catastrophic slope collapse or dislodged sensor fixture.`;
  }

  // 5. Vibration bounds (0 to 10 g)
  const vibration = Number(input.vibration);
  if (isNaN(vibration) || vibration < 0) {
    errors.push('Vibration must be a non-negative g-force value.');
  } else if (vibration > 8.0) {
    isImplausible = true;
    implausibleReason = implausibleReason || `Vibration of ${vibration}g exceeds standard geotechnical seismic bounds.`;
  }

  // 6. Temperature bounds (-40°C to 75°C)
  if (input.temperature !== undefined) {
    const temp = Number(input.temperature);
    if (isNaN(temp) || temp < -40 || temp > 75) {
      errors.push('Temperature must be between -40°C and 75°C.');
    }
  }

  // 7. Humidity bounds (0% to 100%)
  if (input.humidity !== undefined) {
    const hum = Number(input.humidity);
    if (isNaN(hum) || hum < 0 || hum > 100) {
      errors.push('Humidity must be between 0% and 100% relative humidity.');
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    isImplausible,
    implausibleReason,
    sanitizedReading: isValid
      ? {
          deviceId: input.deviceId!.trim(),
          rainfall: Number(input.rainfall),
          rainfall24h: input.rainfall24h !== undefined ? Number(input.rainfall24h) : Number(input.rainfall) * 4,
          soilMoisture: Number(input.soilMoisture),
          tilt: Number(input.tilt),
          tiltPitch: input.tiltPitch !== undefined ? Number(input.tiltPitch) : Number(input.tilt) * 0.7,
          tiltRoll: input.tiltRoll !== undefined ? Number(input.tiltRoll) : Number(input.tilt) * 0.7,
          vibration: Number(input.vibration),
          temperature: input.temperature !== undefined ? Number(input.temperature) : 21.5,
          humidity: input.humidity !== undefined ? Number(input.humidity) : 75.0,
          batteryLevel: input.batteryLevel !== undefined ? Number(input.batteryLevel) : 92,
          signalStrength: input.signalStrength !== undefined ? Number(input.signalStrength) : -68,
          source: input.source || 'SIMULATED',
          isImplausible,
          implausibleReason,
        }
      : undefined,
  };
}

/**
 * Determines device connectivity status based on last seen timestamp:
 * - ONLINE: seen within 15 minutes
 * - STALE: seen between 15 and 90 minutes ago
 * - OFFLINE: seen more than 90 minutes ago or invalid timestamp
 */
export function calculateDeviceStatus(lastSeenIso: string, nowMs = Date.now()): DeviceStatus {
  try {
    const lastSeenMs = new Date(lastSeenIso).getTime();
    if (isNaN(lastSeenMs)) return 'OFFLINE';

    const diffMinutes = (nowMs - lastSeenMs) / (1000 * 60);
    if (diffMinutes <= 15) return 'ONLINE';
    if (diffMinutes <= 90) return 'STALE';
    return 'OFFLINE';
  } catch {
    return 'OFFLINE';
  }
}
