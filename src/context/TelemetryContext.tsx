import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Device,
  SensorReading,
  Alert,
  RiskAssessment,
  RiskThresholdConfig,
  RiskLevel,
  CreateReadingRequest,
  CreateDeviceRequest,
} from '../types/telemetry';
import type { ApiEnvironmentStatus } from '../lib/apiClient';
import { apiClient } from '../lib/apiClient';
import { loadThresholds, saveThresholds, resetDemoState } from '../lib/storage';

interface TelemetryContextType {
  devices: Device[];
  readings: SensorReading[];
  latestReadings: SensorReading[];
  alerts: Alert[];
  currentAssessments: RiskAssessment[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
  timeRange: '6h' | '24h' | '7d';
  setTimeRange: (range: '6h' | '24h' | '7d') => void;
  riskFilter: 'ALL' | RiskLevel;
  setRiskFilter: (filter: 'ALL' | RiskLevel) => void;
  thresholds: RiskThresholdConfig;
  updateThresholds: (t: RiskThresholdConfig) => void;
  submitReading: (req: CreateReadingRequest) => Promise<{ reading: SensorReading; assessment: RiskAssessment; alert?: Alert }>;
  registerDevice: (req: CreateDeviceRequest) => Promise<Device>;
  acknowledgeAlert: (alertId: string, actionTaken?: string) => Promise<Alert>;
  refreshAll: () => Promise<void>;
  resetAllDemoData: () => void;
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  environmentStatus: ApiEnvironmentStatus;
  isLoading: boolean;
  lastUpdated: string;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [latestReadings, setLatestReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentAssessments, setCurrentAssessments] = useState<RiskAssessment[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<'6h' | '24h' | '7d'>('24h');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [thresholds, setThresholdsState] = useState<RiskThresholdConfig>(() => loadThresholds());
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(() => new Date().toISOString());
  const [environmentStatus, setEnvironmentStatus] = useState<ApiEnvironmentStatus>(
    () => apiClient.getEnvironmentStatus()
  );

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [devList, latestList, histList, alertList, riskList] = await Promise.all([
        apiClient.getDevices(),
        apiClient.getLatestReadings(),
        apiClient.getReadingsHistory({ limit: 120 }),
        apiClient.getAlerts(),
        apiClient.getCurrentRisk(),
      ]);

      setDevices(devList);
      setLatestReadings(latestList);
      setReadings(histList);
      setAlerts(alertList);
      setCurrentAssessments(riskList);
      setEnvironmentStatus(apiClient.getEnvironmentStatus());
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('Failed to load telemetry data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchTelemetry = async () => {
      if (isMounted) {
        await refreshAll();
      }
    };
    fetchTelemetry();
    const interval = setInterval(() => {
      if (isMounted) refreshAll();
    }, 45000); // 45s periodic refresh
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [refreshAll]);

  const updateThresholds = (t: RiskThresholdConfig) => {
    saveThresholds(t);
    setThresholdsState(t);
    refreshAll();
  };

  const submitReading = async (req: CreateReadingRequest) => {
    const res = await apiClient.postReading(req);
    await refreshAll();
    return res;
  };

  const registerDevice = async (req: CreateDeviceRequest) => {
    const dev = await apiClient.postDevice(req);
    await refreshAll();
    return dev;
  };

  const acknowledgeAlert = async (alertId: string, actionTaken?: string) => {
    const acked = await apiClient.acknowledgeAlert(alertId, {
      acknowledgedBy: 'Duty Geotechnical Specialist',
      actionTaken: actionTaken || 'Field verification initiated; reading logged in geological ledger.',
    });
    await refreshAll();
    return acked;
  };

  const resetAllDemoData = () => {
    resetDemoState();
    refreshAll();
  };

  return (
    <TelemetryContext.Provider
      value={{
        devices,
        readings,
        latestReadings,
        alerts,
        currentAssessments,
        selectedDeviceId,
        setSelectedDeviceId,
        timeRange,
        setTimeRange,
        riskFilter,
        setRiskFilter,
        thresholds,
        updateThresholds,
        submitReading,
        registerDevice,
        acknowledgeAlert,
        refreshAll,
        resetAllDemoData,
        isSimulatorOpen,
        setIsSimulatorOpen,
        environmentStatus,
        isLoading,
        lastUpdated,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
