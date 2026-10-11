/**
 * TerraShield AI — Deterministic Rule-Based Landslide Hazard Engine
 * 
 * DISCLAIMER:
 * This is a transparent rule-based geotechnical risk calculation model.
 * It is NOT a trained machine-learning model and does not guarantee prediction of all slope failures.
 * Real-world evacuation decisions must be guided by authorized disaster management agencies.
 */

import type {
  SensorReading,
  RiskLevel,
  ThresholdCrossing,
  RiskThresholdConfig,
} from '../types/telemetry';

export const DEFAULT_THRESHOLDS: RiskThresholdConfig = {
  rainfallRateMod: 25.0, // mm/h
  rainfallRateHigh: 45.0, // mm/h
  rainfall24hMod: 80.0, // mm
  rainfall24hHigh: 140.0, // mm
  soilMoistureMod: 72.0, // % VWC
  soilMoistureHigh: 85.0, // % VWC (near saturation)
  tiltMod: 1.5, // degrees deviation
  tiltHigh: 3.5, // degrees deviation (active creep)
  vibrationMod: 0.25, // g peak particle acceleration
  vibrationHigh: 0.65, // g peak particle acceleration
};

export interface RiskEngineResult {
  riskLevel: RiskLevel;
  overallScore: number;
  reason: string;
  factors: {
    rainfallScore: number;
    soilMoistureScore: number;
    tiltScore: number;
    vibrationScore: number;
  };
  thresholdsCrossed: ThresholdCrossing[];
  engineVersion: string;
  mlUpgradeAvailable: boolean;
  recommendedAction: string;
}

/**
 * Calculates deterministic risk assessment using geotechnical slope-stability heuristics.
 */
export function evaluateRisk(
  reading: Partial<SensorReading>,
  customThresholds: RiskThresholdConfig = DEFAULT_THRESHOLDS
): RiskEngineResult {
  const rainfallRate = Number(reading.rainfall ?? 0);
  const rainfall24h = Number(reading.rainfall24h ?? (rainfallRate * 4)); // fallback conservative heuristic
  const soilMoisture = Number(reading.soilMoisture ?? 0);
  const tilt = Number(reading.tilt ?? 0);
  const vibration = Number(reading.vibration ?? 0);

  const thresholdsCrossed: ThresholdCrossing[] = [];

  // 1. Evaluate Rainfall Factor (Peak & Cumulative)
  let rainfallScore = 0;
  if (rainfallRate >= customThresholds.rainfallRateHigh) {
    rainfallScore = 95;
    thresholdsCrossed.push({
      metric: 'rainfallRate',
      label: 'Peak Rainfall Rate',
      value: rainfallRate,
      threshold: customThresholds.rainfallRateHigh,
      unit: 'mm/h',
      severity: 'HIGH',
    });
  } else if (rainfallRate >= customThresholds.rainfallRateMod) {
    rainfallScore = 65;
    thresholdsCrossed.push({
      metric: 'rainfallRate',
      label: 'Peak Rainfall Rate',
      value: rainfallRate,
      threshold: customThresholds.rainfallRateMod,
      unit: 'mm/h',
      severity: 'MODERATE',
    });
  } else {
    rainfallScore = Math.min(50, Math.round((rainfallRate / customThresholds.rainfallRateMod) * 50));
  }

  if (rainfall24h >= customThresholds.rainfall24hHigh) {
    rainfallScore = Math.max(rainfallScore, 90);
    thresholdsCrossed.push({
      metric: 'rainfall24h',
      label: '24-Hour Cumulative Rainfall',
      value: rainfall24h,
      threshold: customThresholds.rainfall24hHigh,
      unit: 'mm',
      severity: 'HIGH',
    });
  } else if (rainfall24h >= customThresholds.rainfall24hMod) {
    rainfallScore = Math.max(rainfallScore, 60);
    thresholdsCrossed.push({
      metric: 'rainfall24h',
      label: '24-Hour Cumulative Rainfall',
      value: rainfall24h,
      threshold: customThresholds.rainfall24hMod,
      unit: 'mm',
      severity: 'MODERATE',
    });
  }

  // 2. Evaluate Soil Moisture (Volumetric Water Content - pore pressure indicator)
  let soilMoistureScore = 0;
  if (soilMoisture >= customThresholds.soilMoistureHigh) {
    soilMoistureScore = 95;
    thresholdsCrossed.push({
      metric: 'soilMoisture',
      label: 'Volumetric Soil Moisture',
      value: soilMoisture,
      threshold: customThresholds.soilMoistureHigh,
      unit: '% VWC',
      severity: 'HIGH',
    });
  } else if (soilMoisture >= customThresholds.soilMoistureMod) {
    soilMoistureScore = 60;
    thresholdsCrossed.push({
      metric: 'soilMoisture',
      label: 'Volumetric Soil Moisture',
      value: soilMoisture,
      threshold: customThresholds.soilMoistureMod,
      unit: '% VWC',
      severity: 'MODERATE',
    });
  } else {
    soilMoistureScore = Math.min(50, Math.round((soilMoisture / customThresholds.soilMoistureMod) * 50));
  }

  // 3. Evaluate Ground Tilt (Inclinometer slope deformation)
  let tiltScore = 0;
  if (tilt >= customThresholds.tiltHigh) {
    tiltScore = 100; // Physical movement is the highest severity trigger
    thresholdsCrossed.push({
      metric: 'tilt',
      label: 'Biaxial Ground Tilt',
      value: tilt,
      threshold: customThresholds.tiltHigh,
      unit: '°',
      severity: 'HIGH',
    });
  } else if (tilt >= customThresholds.tiltMod) {
    tiltScore = 70;
    thresholdsCrossed.push({
      metric: 'tilt',
      label: 'Biaxial Ground Tilt',
      value: tilt,
      threshold: customThresholds.tiltMod,
      unit: '°',
      severity: 'MODERATE',
    });
  } else {
    tiltScore = Math.min(45, Math.round((tilt / customThresholds.tiltMod) * 45));
  }

  // 4. Evaluate Vibration / Micro-tremors
  let vibrationScore = 0;
  if (vibration >= customThresholds.vibrationHigh) {
    vibrationScore = 90;
    thresholdsCrossed.push({
      metric: 'vibration',
      label: 'Peak Ground Acceleration (PPA)',
      value: vibration,
      threshold: customThresholds.vibrationHigh,
      unit: 'g',
      severity: 'HIGH',
    });
  } else if (vibration >= customThresholds.vibrationMod) {
    vibrationScore = 60;
    thresholdsCrossed.push({
      metric: 'vibration',
      label: 'Peak Ground Acceleration (PPA)',
      value: vibration,
      threshold: customThresholds.vibrationMod,
      unit: 'g',
      severity: 'MODERATE',
    });
  } else {
    vibrationScore = Math.min(40, Math.round((vibration / customThresholds.vibrationMod) * 40));
  }

  // Multi-Factor Composite Score:
  // Tilt (35%), Soil Moisture (30%), Rainfall (25%), Vibration (10%)
  const overallScore = Math.min(
    100,
    Math.round(
      tiltScore * 0.35 +
      soilMoistureScore * 0.30 +
      rainfallScore * 0.25 +
      vibrationScore * 0.10
    )
  );

  // Classification Rules
  let riskLevel: RiskLevel = 'LOW';
  let reason = 'Slope stability metrics within normal baseline tolerances.';
  let recommendedAction = 'Routine automated telemetry monitoring active.';

  const highCrossings = thresholdsCrossed.filter(t => t.severity === 'HIGH');
  const modCrossings = thresholdsCrossed.filter(t => t.severity === 'MODERATE');

  if (highCrossings.length > 0 || overallScore >= 75) {
    riskLevel = 'HIGH';
    const reasonsList = highCrossings.map(t => `${t.label} at ${t.value}${t.unit} (exceeds demo threshold ${t.threshold}${t.unit})`);
    reason = `HIGH HAZARD (PROTOTYPE): Demonstration rules flag threshold breaches: ${reasonsList.join('; ')}. Prototype risk rules indicate elevated readings; field verification and local authority guidance are required.`;
    recommendedAction = 'PROTOTYPE ADVISORY: Notify regional geotechnical engineers for field validation and follow local life-safety directives. Demonstration rules are not an official warning.';
  } else if (modCrossings.length > 0 || overallScore >= 45) {
    riskLevel = 'MODERATE';
    const reasonsList = modCrossings.map(t => `${t.label} at ${t.value}${t.unit} (exceeds demo threshold ${t.threshold}${t.unit})`);
    reason = `MODERATE RISK (PROTOTYPE): Elevated readings detected: ${reasonsList.join('; ')}. Prototype rules indicate increased hydrological or kinematic activity; ongoing monitoring advised.`;
    recommendedAction = 'HEIGHTENED WATCH: Increase sensor sampling frequency, inspect visual slope markers, and verify field drainage channels.';
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
    mlUpgradeAvailable: true,
    recommendedAction,
  };
}

/**
 * Modular Interface for ML (XGBoost) Landslide Prediction Model.
 * Currently disabled by default; provides explicit signature for future trained SageMaker / ONNX deployment.
 */
export interface XGBoostModelAdapter {
  isAvailable: boolean;
  modelIdentifier: string;
  predict: (reading: SensorReading) => Promise<{
    probability: number;
    shapValues: Record<string, number>;
  }>;
}

export const XGBoostAdapterStub: XGBoostModelAdapter = {
  isAvailable: false,
  modelIdentifier: 'xgboost-landslide-v2-pending-field-validation',
  predict: async () => {
    throw new Error(
      'XGBoost model is currently disabled. Training data and field geotechnical validation are pending. The system operates strictly on transparent rule-based heuristics.'
    );
  },
};
