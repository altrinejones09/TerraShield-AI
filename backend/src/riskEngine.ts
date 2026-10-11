/**
 * TerraShield AI — Backend Deterministic Geotechnical Risk Engine
 */

export interface RiskEngineResult {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  overallScore: number;
  reason: string;
  factors: {
    rainfallScore: number;
    soilMoistureScore: number;
    tiltScore: number;
    vibrationScore: number;
  };
  thresholdsCrossed: {
    metric: string;
    label: string;
    value: number;
    threshold: number;
    unit: string;
    severity: 'MODERATE' | 'HIGH';
  }[];
  engineVersion: string;
  recommendedAction: string;
}

export const BACKEND_THRESHOLDS = {
  rainfallRateMod: 25.0,
  rainfallRateHigh: 45.0,
  rainfall24hMod: 80.0,
  rainfall24hHigh: 140.0,
  soilMoistureMod: 72.0,
  soilMoistureHigh: 85.0,
  tiltMod: 1.5,
  tiltHigh: 3.5,
  vibrationMod: 0.25,
  vibrationHigh: 0.65,
};

export function evaluateBackendRisk(
  reading: {
    rainfall: number;
    rainfall24h?: number;
    soilMoisture: number;
    tilt: number;
    vibration: number;
  },
  thresholds = BACKEND_THRESHOLDS
): RiskEngineResult {
  const rainfallRate = Number(reading.rainfall ?? 0);
  const rainfall24h = Number(reading.rainfall24h ?? rainfallRate * 4);
  const soilMoisture = Number(reading.soilMoisture ?? 0);
  const tilt = Number(reading.tilt ?? 0);
  const vibration = Number(reading.vibration ?? 0);

  const thresholdsCrossed: RiskEngineResult['thresholdsCrossed'] = [];

  // Rainfall Factor
  let rainfallScore = 0;
  if (rainfallRate >= thresholds.rainfallRateHigh) {
    rainfallScore = 95;
    thresholdsCrossed.push({
      metric: 'rainfallRate',
      label: 'Peak Rainfall Rate',
      value: rainfallRate,
      threshold: thresholds.rainfallRateHigh,
      unit: 'mm/h',
      severity: 'HIGH',
    });
  } else if (rainfallRate >= thresholds.rainfallRateMod) {
    rainfallScore = 65;
    thresholdsCrossed.push({
      metric: 'rainfallRate',
      label: 'Peak Rainfall Rate',
      value: rainfallRate,
      threshold: thresholds.rainfallRateMod,
      unit: 'mm/h',
      severity: 'MODERATE',
    });
  } else {
    rainfallScore = Math.min(50, Math.round((rainfallRate / thresholds.rainfallRateMod) * 50));
  }

  if (rainfall24h >= thresholds.rainfall24hHigh) {
    rainfallScore = Math.max(rainfallScore, 90);
    thresholdsCrossed.push({
      metric: 'rainfall24h',
      label: '24-Hour Cumulative Rainfall',
      value: rainfall24h,
      threshold: thresholds.rainfall24hHigh,
      unit: 'mm',
      severity: 'HIGH',
    });
  } else if (rainfall24h >= thresholds.rainfall24hMod) {
    rainfallScore = Math.max(rainfallScore, 60);
    thresholdsCrossed.push({
      metric: 'rainfall24h',
      label: '24-Hour Cumulative Rainfall',
      value: rainfall24h,
      threshold: thresholds.rainfall24hMod,
      unit: 'mm',
      severity: 'MODERATE',
    });
  }

  // Soil Moisture Factor
  let soilMoistureScore = 0;
  if (soilMoisture >= thresholds.soilMoistureHigh) {
    soilMoistureScore = 95;
    thresholdsCrossed.push({
      metric: 'soilMoisture',
      label: 'Volumetric Soil Moisture',
      value: soilMoisture,
      threshold: thresholds.soilMoistureHigh,
      unit: '% VWC',
      severity: 'HIGH',
    });
  } else if (soilMoisture >= thresholds.soilMoistureMod) {
    soilMoistureScore = 60;
    thresholdsCrossed.push({
      metric: 'soilMoisture',
      label: 'Volumetric Soil Moisture',
      value: soilMoisture,
      threshold: thresholds.soilMoistureMod,
      unit: '% VWC',
      severity: 'MODERATE',
    });
  } else {
    soilMoistureScore = Math.min(50, Math.round((soilMoisture / thresholds.soilMoistureMod) * 50));
  }

  // Tilt Factor
  let tiltScore = 0;
  if (tilt >= thresholds.tiltHigh) {
    tiltScore = 100;
    thresholdsCrossed.push({
      metric: 'tilt',
      label: 'Biaxial Ground Tilt',
      value: tilt,
      threshold: thresholds.tiltHigh,
      unit: '°',
      severity: 'HIGH',
    });
  } else if (tilt >= thresholds.tiltMod) {
    tiltScore = 70;
    thresholdsCrossed.push({
      metric: 'tilt',
      label: 'Biaxial Ground Tilt',
      value: tilt,
      threshold: thresholds.tiltMod,
      unit: '°',
      severity: 'MODERATE',
    });
  } else {
    tiltScore = Math.min(45, Math.round((tilt / thresholds.tiltMod) * 45));
  }

  // Vibration Factor
  let vibrationScore = 0;
  if (vibration >= thresholds.vibrationHigh) {
    vibrationScore = 90;
    thresholdsCrossed.push({
      metric: 'vibration',
      label: 'Peak Ground Acceleration (PPA)',
      value: vibration,
      threshold: thresholds.vibrationHigh,
      unit: 'g',
      severity: 'HIGH',
    });
  } else if (vibration >= thresholds.vibrationMod) {
    vibrationScore = 60;
    thresholdsCrossed.push({
      metric: 'vibration',
      label: 'Peak Ground Acceleration (PPA)',
      value: vibration,
      threshold: thresholds.vibrationMod,
      unit: 'g',
      severity: 'MODERATE',
    });
  } else {
    vibrationScore = Math.min(40, Math.round((vibration / thresholds.vibrationMod) * 40));
  }

  const overallScore = Math.min(
    100,
    Math.round(
      tiltScore * 0.35 +
      soilMoistureScore * 0.30 +
      rainfallScore * 0.25 +
      vibrationScore * 0.10
    )
  );

  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  let reason = 'Slope stability metrics within normal baseline tolerances.';
  let recommendedAction = 'Routine automated telemetry monitoring active.';

  const highCrossings = thresholdsCrossed.filter(t => t.severity === 'HIGH');
  const modCrossings = thresholdsCrossed.filter(t => t.severity === 'MODERATE');

  if (highCrossings.length > 0 || overallScore >= 75) {
    riskLevel = 'HIGH';
    const reasonsList = highCrossings.map(t => `${t.label} at ${t.value}${t.unit}`);
    reason = `HIGH HAZARD: Critical geotechnical breach: ${reasonsList.join('; ')}. Severe slope instability imminent.`;
    recommendedAction = 'TRIGGER CRITICAL ADVISORY: Notify regional geotechnical engineers and prepare local life-safety evacuation procedures according to authority directives.';
  } else if (modCrossings.length > 0 || overallScore >= 45) {
    riskLevel = 'MODERATE';
    const reasonsList = modCrossings.map(t => `${t.label} at ${t.value}${t.unit}`);
    reason = `MODERATE RISK: Elevated hydrological or kinematic readings: ${reasonsList.join('; ')}. Slope shear strength degrading.`;
    recommendedAction = 'HEIGHTENED WATCH: Increase sensor sampling frequency and inspect visual slope markers.';
  }

  return {
    riskLevel,
    overallScore,
    reason,
    factors: {
      rainfallScore,
      soilMoistureScore,
      tiltScore,
      vibrationScore,
    },
    thresholdsCrossed,
    engineVersion: 'RuleEngine-v1.4 (Deterministic Geotechnical)',
    recommendedAction,
  };
}
