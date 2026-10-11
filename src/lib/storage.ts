/**
 * TerraShield AI — Local Persistence Store for Demonstration & Offline Mode
 * Persists demo state (devices, readings, alerts, user settings) across page refreshes.
 * Includes Node/SSR in-memory fallback for headless test runners.
 */

import type { Device, SensorReading, Alert, UserProfile, RiskThresholdConfig } from '../types/telemetry';
import { INITIAL_DEVICES, INITIAL_READINGS, INITIAL_ALERTS } from './mockData';
import { DEFAULT_THRESHOLDS } from './riskEngine';

const STORAGE_KEYS = {
  DEVICES: 'terrashield_devices_v1',
  READINGS: 'terrashield_readings_v1',
  ALERTS: 'terrashield_alerts_v1',
  THRESHOLDS: 'terrashield_thresholds_v1',
  USER: 'terrashield_user_v1',
  ENV_MODE: 'terrashield_env_mode_v1',
};

// Node test runner in-memory fallback
const memoryStore = new Map<string, string>();

function getItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return memoryStore.get(key) || null;
  } catch {
    return memoryStore.get(key) || null;
  }
}

function setItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    } else {
      memoryStore.set(key, value);
    }
  } catch {
    memoryStore.set(key, value);
  }
}

function removeItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    } else {
      memoryStore.delete(key);
    }
  } catch {
    memoryStore.delete(key);
  }
}

export const DEFAULT_USER: UserProfile = {
  id: 'USR-DEMO-001',
  email: 'analyst@terrashield.internal',
  name: 'Elena Rostova, P.E.',
  organization: 'Geological Hazard Mitigation Authority',
  role: 'GEOTECHNICAL_ANALYST',
  notificationPreferences: {
    emailAlerts: true,
    smsAlerts: true,
    emergencyBroadcastAlerts: true,
    highRiskOnly: false,
  },
  timeZone: 'UTC+05:30 (Asia/Kolkata)',
  authorizedLocations: [
    'Western Ghats, Sector 4A (KM 42 Ghat Road)',
    'Himalayan Ridge, Upper Alaknanda Valley',
    'Highway 20 Slope, Pacific Northwest',
  ],
  isDemoUser: true,
};

export function loadDevices(): Device[] {
  try {
    const raw = getItem(STORAGE_KEYS.DEVICES);
    if (!raw) {
      saveDevices(INITIAL_DEVICES);
      return INITIAL_DEVICES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEVICES;
  }
}

export function saveDevices(devices: Device[]): void {
  setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
}

export function loadReadings(): SensorReading[] {
  try {
    const raw = getItem(STORAGE_KEYS.READINGS);
    if (!raw) {
      saveReadings(INITIAL_READINGS);
      return INITIAL_READINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_READINGS;
  }
}

export function saveReadings(readings: SensorReading[]): void {
  setItem(STORAGE_KEYS.READINGS, JSON.stringify(readings));
}

export function loadAlerts(): Alert[] {
  try {
    const raw = getItem(STORAGE_KEYS.ALERTS);
    if (!raw) {
      saveAlerts(INITIAL_ALERTS);
      return INITIAL_ALERTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ALERTS;
  }
}

export function saveAlerts(alerts: Alert[]): void {
  setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
}

export function loadThresholds(): RiskThresholdConfig {
  try {
    const raw = getItem(STORAGE_KEYS.THRESHOLDS);
    if (!raw) return DEFAULT_THRESHOLDS;
    return { ...DEFAULT_THRESHOLDS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}

export function saveThresholds(thresholds: RiskThresholdConfig): void {
  setItem(STORAGE_KEYS.THRESHOLDS, JSON.stringify(thresholds));
}

export function loadUser(): UserProfile {
  try {
    const raw = getItem(STORAGE_KEYS.USER);
    if (!raw) return DEFAULT_USER;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUser(user: UserProfile): void {
  setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function resetDemoState(): void {
  removeItem(STORAGE_KEYS.DEVICES);
  removeItem(STORAGE_KEYS.READINGS);
  removeItem(STORAGE_KEYS.ALERTS);
  removeItem(STORAGE_KEYS.THRESHOLDS);
  saveDevices(INITIAL_DEVICES);
  saveReadings(INITIAL_READINGS);
  saveAlerts(INITIAL_ALERTS);
}
