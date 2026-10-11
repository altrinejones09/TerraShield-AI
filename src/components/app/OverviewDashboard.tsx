import React from 'react';
import {
  CloudRain,
  Droplet,
  Compass,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { RiskBadge } from '../common/RiskBadge';
import { StatusPill } from '../common/StatusPill';
import { MetricCard } from '../common/MetricCard';
import { TimeSeriesChart } from '../common/TimeSeriesChart';
import { RadarRiskIndicator } from '../common/RadarRiskIndicator';

interface OverviewDashboardProps {
  onNavigateToView: (view: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigateToView }) => {
  const {
    devices,
    latestReadings,
    readings,
    alerts,
    currentAssessments,
    selectedDeviceId,
    timeRange,
    setTimeRange,
    thresholds,
    acknowledgeAlert,
    lastUpdated,
  } = useTelemetry();

  // Find targeted reading
  const activeReading =
    selectedDeviceId === 'ALL'
      ? latestReadings[0] || null
      : latestReadings.find(r => r.deviceId === selectedDeviceId) || null;

  const activeDevice =
    activeReading && devices.find(d => d.deviceId === activeReading.deviceId);

  const activeAssessment =
    activeReading && currentAssessments.find(a => a.deviceId === activeReading.deviceId);

  // Filter time series data for charts
  const filteredReadings =
    selectedDeviceId === 'ALL'
      ? readings.filter(r => r.deviceId === (devices[0]?.deviceId || 'NODE-SLOPE-01'))
      : readings.filter(r => r.deviceId === selectedDeviceId);

  const activeAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Warning Banner / Disaster Guidance */}
      <div className="disclaimer-banner">
        <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.825rem' }}>
          <strong>SIMULATED DEMONSTRATION WORKSPACE:</strong> Telemetry values reflect deterministic test scenarios. In case of real geological hazard events, follow instructions directly from local disaster management authorities (NDMA/USGS/BMKG).
        </div>
      </div>

      {/* Main Status & Risk Assessment Hero Panel */}
      {activeReading && activeAssessment && (
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem 2rem',
            borderLeft:
              activeAssessment.riskLevel === 'HIGH'
                ? '5px solid #f43f5e'
                : activeAssessment.riskLevel === 'MODERATE'
                ? '5px solid #f59e0b'
                : '5px solid #10b981',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <RiskBadge level={activeAssessment.riskLevel} size="lg" />
                <StatusPill type="data-source" value={activeReading.source} />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Updated: {new Date(activeReading.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                {activeDevice ? activeDevice.name : activeReading.deviceId}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                {activeDevice ? activeDevice.locationLabel : 'Monitored Escarpment'} &bull; Slope Angle: {activeDevice?.slopeAngle || 42}°
              </p>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Risk Engine Assessment Reasoning:
                </div>
                <p style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
                  {activeAssessment.reason}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#38bdf8' }}>
                <ShieldCheck size={16} />
                <span>{activeAssessment.recommendedAction}</span>
              </div>
            </div>

            {/* Radar Factor Matrix */}
            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
              <RadarRiskIndicator
                overallScore={activeAssessment.overallScore}
                rainfallScore={activeAssessment.factors.rainfallScore}
                soilMoistureScore={activeAssessment.factors.soilMoistureScore}
                tiltScore={activeAssessment.factors.tiltScore}
                vibrationScore={activeAssessment.factors.vibrationScore}
                size={190}
              />
            </div>
          </div>
        </div>
      )}

      {/* Key Geotechnical Metric Cards */}
      {activeReading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <MetricCard
            title="Peak Rainfall Rate"
            value={activeReading.rainfall}
            unit="mm/h"
            secondaryValue={`24h Cumulative: ${activeReading.rainfall24h} mm`}
            icon={<CloudRain size={20} />}
            thresholdMod={thresholds.rainfallRateMod}
            thresholdHigh={thresholds.rainfallRateHigh}
            maxScale={60}
            isImplausible={activeReading.isImplausible}
            implausibleReason={activeReading.implausibleReason}
          />

          <MetricCard
            title="Soil Moisture Saturation"
            value={activeReading.soilMoisture}
            unit="% VWC"
            secondaryValue="Frequency-Domain Probe"
            icon={<Droplet size={20} />}
            thresholdMod={thresholds.soilMoistureMod}
            thresholdHigh={thresholds.soilMoistureHigh}
            maxScale={100}
          />

          <MetricCard
            title="Biaxial Inclinometer Tilt"
            value={activeReading.tilt}
            unit="°"
            secondaryValue={`Pitch: ${activeReading.tiltPitch ?? (activeReading.tilt * 0.7).toFixed(1)}° | Roll: ${activeReading.tiltRoll ?? (activeReading.tilt * 0.7).toFixed(1)}°`}
            icon={<Compass size={20} />}
            thresholdMod={thresholds.tiltMod}
            thresholdHigh={thresholds.tiltHigh}
            maxScale={6}
          />

          <MetricCard
            title="Peak Ground Acceleration"
            value={activeReading.vibration}
            unit="g"
            secondaryValue="Seismic / Tremor PPA"
            icon={<Radio size={20} />}
            thresholdMod={thresholds.vibrationMod}
            thresholdHigh={thresholds.vibrationHigh}
            maxScale={1.0}
          />
        </div>
      )}

      {/* Time-Series Charts & Filter Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
              Historical Telemetry Trends
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Correlating hydrological triggers with kinematic inclinometer movement
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem', borderRadius: '8px' }}>
            {(['6h', '24h', '7d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  color: timeRange === range ? '#ffffff' : '#94a3b8',
                  backgroundColor: timeRange === range ? '#0ea5e9' : 'transparent',
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.25rem' }}>
          <TimeSeriesChart
            title="Hydrological Load (Rainfall &amp; Soil Saturation)"
            subtitle="Comparing mm/h precipitation vs volumetric water content"
            data={filteredReadings}
            series={[
              { key: 'rainfall', label: 'Rainfall', color: '#0ea5e9', unit: 'mm/h' },
              { key: 'soilMoisture', label: 'Soil Moisture', color: '#10b981', unit: '%' },
            ]}
            thresholdMod={thresholds.rainfallRateMod}
            thresholdHigh={thresholds.rainfallRateHigh}
            height={250}
          />

          <TimeSeriesChart
            title="Slope Kinematics (Angular Tilt &amp; Micro-Vibration)"
            subtitle="Biaxial inclinometer deflection tracking active shear creep"
            data={filteredReadings}
            series={[
              { key: 'tilt', label: 'Ground Tilt', color: '#fbbf24', unit: '°' },
              { key: 'vibration', label: 'Vibration PPA', color: '#f43f5e', unit: 'g' },
            ]}
            thresholdMod={thresholds.tiltMod}
            thresholdHigh={thresholds.tiltHigh}
            height={250}
          />
        </div>
      </div>

      {/* Active Alerts & Telemetry Stations Quick Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {/* Active Life-Safety Alerts */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="#f43f5e" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Active Alerts ({activeAlerts.length})
              </h4>
            </div>
            <button
              onClick={() => onNavigateToView('alerts')}
              style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {activeAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b' }}>
              <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>No active hazard alerts across monitored sectors.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeAlerts.slice(0, 3).map(alt => (
                <div
                  key={alt.id}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderLeft: alt.severity === 'CRITICAL' ? '3px solid #f43f5e' : '3px solid #f59e0b',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>{alt.title}</span>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{alt.deviceName}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.3 }}>
                      {alt.message.substring(0, 85)}...
                    </p>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => acknowledgeAlert(alt.id, 'Duty analyst confirmed via overview')}
                    style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', flexShrink: 0 }}
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monitored Nodes Health Summary */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#0ea5e9" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Monitored Escarpment Nodes ({devices.length})
              </h4>
            </div>
            <button
              onClick={() => onNavigateToView('devices')}
              style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              Manage Nodes <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {devices.map(dev => (
              <div
                key={dev.deviceId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                      {dev.name}
                    </span>
                    <StatusPill type="device-status" value={dev.status} size="sm" />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {dev.locationLabel} &bull; Elev: {dev.elevation}m
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                    Health: {dev.healthScore}%
                  </span>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                    Seen: {new Date(dev.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
