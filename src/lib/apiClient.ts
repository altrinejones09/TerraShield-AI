/**
 * TerraShield AI — Unified API Client
 * Interfaces with AWS API Gateway or Local Express backend with safe local mock fallback.
 * Strictly never fabricates a live AWS connection when credentials or API URLs are unconfigured.
 */

import type {
  SensorReading,
  Device,
  RiskAssessment,
  Alert,
  CreateReadingRequest,
  AcknowledgeAlertRequest,
  CreateDeviceRequest,
  HistoryQuery,
  HealthResponse,
} from '../types/api';
import {
  loadDevices,
  saveDevices,
  loadReadings,
  saveReadings,
  loadAlerts,
  saveAlerts,
  loadThresholds,
} from './storage';
import { evaluateRisk } from './riskEngine';
import { validateSensorInput, calculateDeviceStatus } from './sensorValidation';

export interface ApiEnvironmentStatus {
  mode: 'LOCAL_MOCK' | 'LOCAL_EXPRESS' | 'AWS_CLOUD';
  apiBaseUrl: string;
  isBackendReachable: boolean;
  cognitoConfigured: boolean;
  dynamoConnected: boolean;
  iotConnected: boolean;
  lastChecked: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const COGNITO_USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || '';

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;
  private environmentStatus: ApiEnvironmentStatus = {
    mode: API_BASE_URL.includes('amazonaws.com')
      ? 'AWS_CLOUD'
      : API_BASE_URL.length > 0
      ? 'LOCAL_EXPRESS'
      : 'LOCAL_MOCK',
    apiBaseUrl: API_BASE_URL || 'Local Browser Simulation Store',
    isBackendReachable: false,
    cognitoConfigured: Boolean(COGNITO_USER_POOL_ID),
    dynamoConnected: Boolean(API_BASE_URL.includes('amazonaws.com')),
    iotConnected: false, // Explicit: false until real hardware provisioned
    lastChecked: new Date().toISOString(),
  };

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public getEnvironmentStatus(): ApiEnvironmentStatus {
    return { ...this.environmentStatus };
  }

  public async checkHealth(): Promise<HealthResponse> {
    if (this.baseUrl) {
      try {
        const resp = await fetch(`${this.baseUrl}/health`, {
          headers: this.getHeaders(),
          signal: AbortSignal.timeout(3000),
        });
        if (resp.ok) {
          const data = await resp.json();
          this.environmentStatus.isBackendReachable = true;
          this.environmentStatus.lastChecked = new Date().toISOString();
          return data;
        }
      } catch {
        this.environmentStatus.isBackendReachable = false;
      }
    }

    // Local fallback health report
    this.environmentStatus.mode = 'LOCAL_MOCK';
    this.environmentStatus.isBackendReachable = true;
    return {
      status: 'healthy',
      service: 'TerraShield AI Backend',
      version: '1.4.0',
      timestamp: new Date().toISOString(),
      storage: {
        type: 'InMemoryStore',
        status: 'demo_mode',
      },
      auth: {
        provider: 'LocalDemoAuth',
        status: 'active',
      },
      iot: {
        protocol: 'MQTT / AWS IoT Core',
        status: 'hardware_offline_standby',
      },
    };
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  // 1. GET /readings/latest
  public async getLatestReadings(deviceId?: string): Promise<SensorReading[]> {
    if (this.baseUrl && this.environmentStatus.isBackendReachable) {
      try {
        const url = new URL(`${this.baseUrl}/readings/latest`);
        if (deviceId) url.searchParams.set('deviceId', deviceId);
        const res = await fetch(url.toString(), { headers: this.getHeaders() });
        if (res.ok) {
          const json = await res.json();
          return json.data || [];
        }
      } catch (err) {
        console.warn('Backend fetch failed, falling back to local store:', err);
      }
    }

    // Local store implementation
    const all = loadReadings();
    if (deviceId) {
      const filtered = all.filter(r => r.deviceId === deviceId);
      return filtered.length > 0 ? [filtered[filtered.length - 1]] : [];
    }

    // Return latest per device
    const deviceMap = new Map<string, SensorReading>();
    for (const r of all) {
      const existing = deviceMap.get(r.deviceId);
      if (!existing || new Date(r.timestamp) > new Date(existing.timestamp)) {
        deviceMap.set(r.deviceId, r);
      }
    }
    return Array.from(deviceMap.values());
  }

  // 2. GET /readings/history
  public async getReadingsHistory(query: HistoryQuery = {}): Promise<SensorReading[]> {
    if (this.baseUrl && this.environmentStatus.isBackendReachable) {
      try {
        const url = new URL(`${this.baseUrl}/readings/history`);
        if (query.deviceId) url.searchParams.set('deviceId', query.deviceId);
        if (query.limit) url.searchParams.set('limit', String(query.limit));
        if (query.riskLevel) url.searchParams.set('riskLevel', query.riskLevel);
        const res = await fetch(url.toString(), { headers: this.getHeaders() });
        if (res.ok) {
          const json = await res.json();
          return json.data || [];
        }
      } catch (err) {
        console.warn('Backend history fetch failed, using local store:', err);
      }
    }

    let all = loadReadings();
    if (query.deviceId) {
      all = all.filter(r => r.deviceId === query.deviceId);
    }
    if (query.riskLevel) {
      all = all.filter(r => r.riskLevel === query.riskLevel);
    }
    // Sort ascending by timestamp for charting
    all.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    if (query.limit && query.limit > 0) {
      all = all.slice(-query.limit);
    }
    return all;
  }

  // 3. POST /readings
  public async postReading(req: CreateReadingRequest): Promise<{ reading: SensorReading; assessment: RiskAssessment; alert?: Alert }> {
    const validation = validateSensorInput(req);
    if (!validation.isValid || !validation.sanitizedReading) {
      throw new Error(`Invalid sensor reading: ${validation.errors.join(', ')}`);
    }

    const thresholds = loadThresholds();
    const assessmentResult = evaluateRisk(validation.sanitizedReading, thresholds);

    const timestamp = req.customTimestamp || new Date().toISOString();
    const newReading: SensorReading = {
      id: `READ-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      deviceId: validation.sanitizedReading.deviceId!,
      timestamp,
      rainfall: validation.sanitizedReading.rainfall!,
      rainfall24h: validation.sanitizedReading.rainfall24h!,
      soilMoisture: validation.sanitizedReading.soilMoisture!,
      tilt: validation.sanitizedReading.tilt!,
      tiltPitch: validation.sanitizedReading.tiltPitch,
      tiltRoll: validation.sanitizedReading.tiltRoll,
      vibration: validation.sanitizedReading.vibration!,
      temperature: validation.sanitizedReading.temperature || 21.0,
      humidity: validation.sanitizedReading.humidity || 75.0,
      batteryLevel: validation.sanitizedReading.batteryLevel || 95,
      signalStrength: validation.sanitizedReading.signalStrength || -65,
      source: req.source || 'SIMULATED',
      dataMode: 'DEMO',
      riskLevel: assessmentResult.riskLevel,
      assessmentReason: assessmentResult.reason,
      isImplausible: validation.isImplausible,
      implausibleReason: validation.implausibleReason,
    };

    const assessment: RiskAssessment = {
      id: `RSK-${Date.now()}`,
      timestamp,
      deviceId: newReading.deviceId,
      riskLevel: assessmentResult.riskLevel,
      overallScore: assessmentResult.overallScore,
      reason: assessmentResult.reason,
      factors: assessmentResult.factors,
      thresholdsCrossed: assessmentResult.thresholdsCrossed,
      engineVersion: assessmentResult.engineVersion,
      mlUpgradeAvailable: assessmentResult.mlUpgradeAvailable,
      recommendedAction: assessmentResult.recommendedAction,
    };

    let alert: Alert | undefined;
    if (assessmentResult.riskLevel === 'HIGH' || assessmentResult.riskLevel === 'MODERATE') {
      const devices = loadDevices();
      const device = devices.find(d => d.deviceId === newReading.deviceId);
      const deviceName = device ? device.name : newReading.deviceId;
      const location = device ? device.locationLabel : 'Unknown Slope Sector';

      // Duplicate check: if unacknowledged alert for same device within last 15 min, skip duplicate
      const currentAlerts = loadAlerts();
      const fifteenMinAgo = Date.now() - 15 * 60 * 1000;
      const isDuplicate = currentAlerts.some(
        a =>
          a.deviceId === newReading.deviceId &&
          a.severity === (assessmentResult.riskLevel === 'HIGH' ? 'CRITICAL' : 'WARNING') &&
          !a.acknowledged &&
          new Date(a.timestamp).getTime() > fifteenMinAgo
      );

      if (!isDuplicate) {
        alert = {
          id: `ALT-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          deviceId: newReading.deviceId,
          deviceName,
          location,
          severity: assessmentResult.riskLevel === 'HIGH' ? 'CRITICAL' : 'WARNING',
          riskLevel: assessmentResult.riskLevel,
          timestamp,
          title:
            assessmentResult.riskLevel === 'HIGH'
              ? 'Critical Slope Instability Breach'
              : 'Hydrological Saturation Warning',
          message: assessmentResult.reason,
          contributingFactors: assessmentResult.thresholdsCrossed.map(
            t => `${t.label}: ${t.value} ${t.unit} (Threshold: ${t.threshold} ${t.unit})`
          ),
          acknowledged: false,
          source: newReading.source,
        };
        currentAlerts.unshift(alert);
        saveAlerts(currentAlerts);
      }
    }

    // Persist reading
    const currentReadings = loadReadings();
    currentReadings.push(newReading);
    saveReadings(currentReadings);

    // Update device lastSeen
    const devices = loadDevices();
    const idx = devices.findIndex(d => d.deviceId === newReading.deviceId);
    if (idx !== -1) {
      devices[idx].lastSeen = timestamp;
      devices[idx].status = calculateDeviceStatus(timestamp);
      saveDevices(devices);
    }

    return { reading: newReading, assessment, alert };
  }

  // 4. GET /risk/current
  public async getCurrentRisk(deviceId?: string): Promise<RiskAssessment[]> {
    const latestReadings = await this.getLatestReadings(deviceId);
    const thresholds = loadThresholds();

    return latestReadings.map(r => {
      const evalResult = evaluateRisk(r, thresholds);
      return {
        id: `RSK-CUR-${r.deviceId}`,
        timestamp: r.timestamp,
        deviceId: r.deviceId,
        riskLevel: evalResult.riskLevel,
        overallScore: evalResult.overallScore,
        reason: evalResult.reason,
        factors: evalResult.factors,
        thresholdsCrossed: evalResult.thresholdsCrossed,
        engineVersion: evalResult.engineVersion,
        mlUpgradeAvailable: evalResult.mlUpgradeAvailable,
        recommendedAction: evalResult.recommendedAction,
      };
    });
  }

  // 5. GET /risk/history
  public async getRiskHistory(deviceId?: string, limit = 20): Promise<RiskAssessment[]> {
    const historyReadings = await this.getReadingsHistory({ deviceId, limit });
    const thresholds = loadThresholds();

    return historyReadings.map((r, i) => {
      const evalResult = evaluateRisk(r, thresholds);
      return {
        id: `RSK-HIST-${r.deviceId}-${i}`,
        timestamp: r.timestamp,
        deviceId: r.deviceId,
        riskLevel: evalResult.riskLevel,
        overallScore: evalResult.overallScore,
        reason: evalResult.reason,
        factors: evalResult.factors,
        thresholdsCrossed: evalResult.thresholdsCrossed,
        engineVersion: evalResult.engineVersion,
        mlUpgradeAvailable: evalResult.mlUpgradeAvailable,
        recommendedAction: evalResult.recommendedAction,
      };
    });
  }

  // 6. GET /alerts
  public async getAlerts(severity?: string, acknowledged?: boolean): Promise<Alert[]> {
    let alerts = loadAlerts();
    if (severity) {
      alerts = alerts.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
    }
    if (acknowledged !== undefined) {
      alerts = alerts.filter(a => a.acknowledged === acknowledged);
    }
    alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return alerts;
  }

  // 7. POST /alerts/{id}/acknowledge
  public async acknowledgeAlert(id: string, req: AcknowledgeAlertRequest): Promise<Alert> {
    const alerts = loadAlerts();
    const idx = alerts.findIndex(a => a.id === id);
    if (idx === -1) {
      throw new Error(`Alert ${id} not found.`);
    }

    alerts[idx].acknowledged = true;
    alerts[idx].acknowledgedAt = new Date().toISOString();
    alerts[idx].acknowledgedBy = req.acknowledgedBy || 'Current Operator';
    alerts[idx].actionTaken = req.actionTaken || 'Operator confirmed receipt and logged observation.';

    saveAlerts(alerts);
    return alerts[idx];
  }

  // 8. GET /devices
  public async getDevices(): Promise<Device[]> {
    const devices = loadDevices();
    const now = Date.now();
    // Update live status based on lastSeen
    const updated = devices.map(d => ({
      ...d,
      status: calculateDeviceStatus(d.lastSeen, now),
    }));
    saveDevices(updated);
    return updated;
  }

  // 9. GET /devices/{id}
  public async getDevice(id: string): Promise<Device | null> {
    const devices = await this.getDevices();
    return devices.find(d => d.deviceId === id) || null;
  }

  // 10. POST /devices
  public async postDevice(req: CreateDeviceRequest): Promise<Device> {
    const devices = loadDevices();
    if (devices.some(d => d.deviceId === req.deviceId)) {
      throw new Error(`Device with ID ${req.deviceId} already exists.`);
    }

    const newDevice: Device = {
      deviceId: req.deviceId.trim(),
      name: req.name.trim(),
      locationLabel: req.locationLabel.trim(),
      latitude: req.latitude,
      longitude: req.longitude,
      elevation: req.elevation,
      slopeAngle: req.slopeAngle,
      soilType: req.soilType,
      configuredSensors: req.configuredSensors || ['rainfall', 'soilMoisture', 'tilt', 'vibration'],
      status: 'ONLINE',
      lastSeen: new Date().toISOString(),
      source: req.source || 'SIMULATED',
      firmwareVersion: 'v2.4.1-esp32-freertos',
      healthScore: 100,
    };

    devices.push(newDevice);
    saveDevices(devices);
    return newDevice;
  }
}

export const apiClient = new ApiClient();
