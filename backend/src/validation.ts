/**
 * TerraShield AI — Backend Input Validation
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: any;
}

export function validateReadingPayload(body: any): ValidationResult {
  const errors: string[] = [];
  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object.'] };
  }

  if (!body.deviceId || typeof body.deviceId !== 'string' || body.deviceId.trim().length === 0) {
    errors.push('Field "deviceId" is required.');
  }

  const rainfall = Number(body.rainfall);
  if (isNaN(rainfall) || rainfall < 0) {
    errors.push('Field "rainfall" must be a non-negative number.');
  }

  const soilMoisture = Number(body.soilMoisture);
  if (isNaN(soilMoisture) || soilMoisture < 0 || soilMoisture > 100) {
    errors.push('Field "soilMoisture" must be between 0 and 100.');
  }

  const tilt = Number(body.tilt);
  if (isNaN(tilt) || tilt < 0) {
    errors.push('Field "tilt" must be a non-negative number in degrees.');
  }

  const vibration = Number(body.vibration);
  if (isNaN(vibration) || vibration < 0) {
    errors.push('Field "vibration" must be a non-negative number in g.');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    sanitized: isValid
      ? {
          deviceId: String(body.deviceId).trim(),
          rainfall: Number(body.rainfall),
          rainfall24h: body.rainfall24h !== undefined ? Number(body.rainfall24h) : Number(body.rainfall) * 4,
          soilMoisture: Number(body.soilMoisture),
          tilt: Number(body.tilt),
          tiltPitch: body.tiltPitch !== undefined ? Number(body.tiltPitch) : Number(body.tilt) * 0.7,
          tiltRoll: body.tiltRoll !== undefined ? Number(body.tiltRoll) : Number(body.tilt) * 0.7,
          vibration: Number(body.vibration),
          temperature: body.temperature !== undefined ? Number(body.temperature) : 21.0,
          humidity: body.humidity !== undefined ? Number(body.humidity) : 75.0,
          source: body.source === 'HARDWARE' ? 'HARDWARE' : 'SIMULATED',
          customTimestamp: body.customTimestamp,
        }
      : undefined,
  };
}

export function validateDevicePayload(body: any): ValidationResult {
  const errors: string[] = [];
  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object.'] };
  }

  if (!body.deviceId || typeof body.deviceId !== 'string') {
    errors.push('Field "deviceId" is required.');
  }
  if (!body.name || typeof body.name !== 'string') {
    errors.push('Field "name" is required.');
  }
  if (!body.locationLabel || typeof body.locationLabel !== 'string') {
    errors.push('Field "locationLabel" is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: body,
  };
}
