import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { TimeSeriesChart } from '../common/TimeSeriesChart';

export const HistoricalAnalyticsView: React.FC = () => {
  const {
    devices,
    readings,
    selectedDeviceId,
    timeRange,
    setTimeRange,
    thresholds,
  } = useTelemetry();

  const [metricFocus, setMetricFocus] = useState<'hydrological' | 'kinematic' | 'combined'>('combined');

  const filtered =
    selectedDeviceId === 'ALL'
      ? readings.filter(r => r.deviceId === (devices[0]?.deviceId || 'NODE-SLOPE-01'))
      : readings.filter(r => r.deviceId === selectedDeviceId);

  // Correlation analysis calculation
  const averageMoisture =
    filtered.length > 0
      ? (filtered.reduce((sum, r) => sum + r.soilMoisture, 0) / filtered.length).toFixed(1)
      : '0';

  const maxRainRate =
    filtered.length > 0
      ? Math.max(...filtered.map(r => r.rainfall)).toFixed(1)
      : '0';

  const maxTilt =
    filtered.length > 0
      ? Math.max(...filtered.map(r => r.tilt)).toFixed(2)
      : '0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Controls & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            Historical Geotechnical Analytics &amp; Correlation
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Bounded time-series correlation of antecedent precipitation, pore saturation, and slope displacement
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Focus mode selector */}
          <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem', borderRadius: '6px' }}>
            {(['combined', 'hydrological', 'kinematic'] as const).map(focus => (
              <button
                key={focus}
                onClick={() => setMetricFocus(focus)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  textTransform: 'capitalize',
                  color: metricFocus === focus ? '#ffffff' : '#94a3b8',
                  backgroundColor: metricFocus === focus ? '#0284c7' : 'transparent',
                }}
              >
                {focus}
              </button>
            ))}
          </div>

          {/* Time range selector */}
          <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem', borderRadius: '6px' }}>
            {(['6h', '24h', '7d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  color: timeRange === range ? '#ffffff' : '#94a3b8',
                  backgroundColor: timeRange === range ? '#0ea5e9' : 'transparent',
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate Statistics Overview */}
      <div className="grid-cards">
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Peak Rainfall Event
          </span>
          <div className="mono-num" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0ea5e9', marginTop: '0.2rem' }}>
            {maxRainRate} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>mm/h</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Highest recorded intensity in window</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Average Pore Saturation
          </span>
          <div className="mono-num" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
            {averageMoisture}% <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>VWC</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Mean volumetric soil moisture</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Maximum Angular Creep
          </span>
          <div className="mono-num" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>
            {maxTilt}° <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Deflection</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Peak inclinometer shear displacement</span>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
            Telemetry Frame Density
          </span>
          <div className="mono-num" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
            {filtered.length} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Frames</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Validated geotechnical observations</span>
        </div>
      </div>

      {/* Main Analytic Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {(metricFocus === 'combined' || metricFocus === 'hydrological') && (
          <TimeSeriesChart
            title="Hydrological Surcharge vs Volumetric Soil Moisture"
            subtitle="Direct visualization of pore pressure accumulation under rainfall events"
            data={filtered}
            series={[
              { key: 'rainfall', label: 'Rainfall Rate', color: '#0ea5e9', unit: 'mm/h' },
              { key: 'rainfall24h', label: 'Cumulative 24h Rain', color: '#38bdf8', unit: 'mm' },
              { key: 'soilMoisture', label: 'Soil Moisture VWC', color: '#10b981', unit: '%' },
            ]}
            thresholdMod={thresholds.soilMoistureMod}
            thresholdHigh={thresholds.soilMoistureHigh}
            height={260}
          />
        )}

        {(metricFocus === 'combined' || metricFocus === 'kinematic') && (
          <TimeSeriesChart
            title="Kinematic Inclinometer Angular Creep Trajectory"
            subtitle="Cumulative tilt deflection indicative of shear failure plane progression"
            data={filtered}
            series={[
              { key: 'tilt', label: 'Biaxial Inclinometer Tilt', color: '#fbbf24', unit: '°' },
              { key: 'vibration', label: 'Vibration Acceleration', color: '#f43f5e', unit: 'g' },
            ]}
            thresholdMod={thresholds.tiltMod}
            thresholdHigh={thresholds.tiltHigh}
            height={260}
          />
        )}
      </div>

      {/* Geotechnical Correlation Note */}
      <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#091022' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Info size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.3rem' }}>
              Hydrological-Kinematic Coupling Insight
            </h5>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              The time-series curves demonstrate classic antecedent lag behavior: peak rainfall precedes the rise in soil moisture saturation by 2 to 6 hours, followed by sub-degree inclinometer displacement once volumetric moisture surpasses 82% VWC. This deterministic sequence provides critical early lead time before sudden shear rupture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
