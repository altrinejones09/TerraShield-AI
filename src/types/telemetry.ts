/**
 * TerraShield AI — Telemetry, Device, Risk, and Alert Types
 * Designed for precision landslide hazard monitoring and life-safety alert workflows.
 */

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export type AlertSeverity = 'ADVISORY' | 'WARNING' | 'CRITICAL';

export type DataSource = 'SIMULATED' | 'HARDWARE';

export type DataMode = 'DEMO' | 'PRODUCTION';

export type DeviceStatus = 'ONLINE' | 'STALE' | 'OFFLINE';

export type SensorType = 
  | 'rainfall' 
  | 'soilMoisture' 
  | 'tilt' 
  | 'vibration' 
  | 'temperature' 
  | 'humidity';

export interface SensorReading {
  id: string;
  deviceId: string;
  timestamp: string; // ISO 8601
  rainfall: number; // mm/h rate
  rainfall24h: number; // 24h cumulative mm
  soilMoisture: number; // % volumetric water content (VWC)
  tilt: number; // degrees total deflection from baseline
  tiltPitch?: number; // pitch axis in degrees
  tiltRoll?: number; // roll axis in degrees
  vibration: number; // g Peak Particle Acceleration
  temperature: number; // °C
  humidity: number; // % RH
  batteryLevel?: number; // % remaining
  signalStrength?: number; // dBm RSSI
  source: DataSource;
  dataMode: DataMode;
  riskLevel: RiskLevel;
  assessmentReason: string;
  isImplausible?: boolean;
  implausibleReason?: string;
}

export interface Device {
  deviceId: string;
  name: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  elevation: number; // meters above sea level
  slopeAngle: number; // degrees
  soilType: string;
  configuredSensors: SensorType[];
  status: DeviceStatus;
  lastSeen: string;
  source: DataSource;
  firmwareVersion: string;
  healthScore: number; // 0-100
  notes?: string;
}

export interface ThresholdCrossing {
  metric: string;
  label: string;
  value: number;
  threshold: number;
  unit: string;
  severity: 'MODERATE' | 'HIGH';
}

export interface RiskAssessment {
  id: string;
  timestamp: string;
  deviceId: string;
  riskLevel: RiskLevel;
  overallScore: number; // 0 to 100 composite index
  reason: string;
  factors: {
    rainfallScore: number;
    soilMoistureScore: number;
    tiltScore: number;
    vibrationScore: number;
  };
  thresholdsCrossed: ThresholdCrossing[];
  engineVersion: string; // e.g. "RuleEngine-v1.4 (Deterministic Geotechnical)"
  mlUpgradeAvailable: boolean;
  recommendedAction: string;
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  location: string;
  severity: AlertSeverity;
  riskLevel: RiskLevel;
  timestamp: string;
  title: string;
  message: string;
  contributingFactors: string[];
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  actionTaken?: string;
  source: DataSource;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: 'OBSERVER' | 'GEOTECHNICAL_ANALYST' | 'INCIDENT_COMMANDER';
  notificationPreferences: {
    emailAlerts: boolean;
    smsAlerts: boolean;
    emergencyBroadcastAlerts: boolean;
    highRiskOnly: boolean;
  };
  timeZone: string;
  authorizedLocations: string[];
  isDemoUser: boolean;
}

export interface RiskThresholdConfig {
  rainfallRateMod: number; // mm/h moderate threshold (default 25)
  rainfallRateHigh: number; // mm/h high threshold (default 45)
  rainfall24hMod: number; // mm 24h cumulative moderate (default 80)
  rainfall24hHigh: number; // mm 24h cumulative high (default 140)
  soilMoistureMod: number; // % VWC moderate (default 72)
  soilMoistureHigh: number; // % VWC high (default 85)
  tiltMod: number; // degrees moderate (default 1.5)
  tiltHigh: number; // degrees high (default 3.5)
  vibrationMod: number; // g moderate (default 0.25)
  vibrationHigh: number; // g high (default 0.65)
}

export interface CreateReadingRequest {
  deviceId: string;
  rainfall: number;
  rainfall24h?: number;
  soilMoisture: number;
  tilt: number;
  tiltPitch?: number;
  tiltRoll?: number;
  vibration: number;
  temperature?: number;
  humidity?: number;
  batteryLevel?: number;
  signalStrength?: number;
  source?: DataSource;
  customTimestamp?: string;
}

export interface CreateDeviceRequest {
  deviceId: string;
  name: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
  elevation: number;
  slopeAngle: number;
  soilType: string;
  configuredSensors?: SensorType[];
  source?: DataSource;
}

export interface AcknowledgeAlertRequest {
  acknowledgedBy: string;
  actionTaken?: string;
}

export interface HistoryQuery {
  deviceId?: string;
  limit?: number;
  startTime?: string;
  endTime?: string;
  riskLevel?: RiskLevel;
}
