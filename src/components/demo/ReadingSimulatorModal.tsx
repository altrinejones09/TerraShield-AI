import React, { useState } from 'react';
import {
  X,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Send,
  Zap,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { validateSensorInput } from '../../lib/sensorValidation';
import { evaluateRisk } from '../../lib/riskEngine';
import { RiskBadge } from '../common/RiskBadge';

export const ReadingSimulatorModal: React.FC = () => {
  const {
    isSimulatorOpen,
    setIsSimulatorOpen,
    devices,
    submitReading,
    thresholds,
    environmentStatus,
  } = useTelemetry();

  const [selectedDevice, setSelectedDevice] = useState(
    devices.length > 0 ? devices[0].deviceId : 'NODE-SLOPE-01'
  );
  const [rainfall, setRainfall] = useState('12.5');
  const [rainfall24h, setRainfall24h] = useState('45.0');
  const [soilMoisture, setSoilMoisture] = useState('58.0');
  const [tilt, setTilt] = useState('0.4');
  const [vibration, setVibration] = useState('0.08');
  const [temperature, setTemperature] = useState('21.0');
  const [humidity, setHumidity] = useState('72.0');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultFeedback, setResultFeedback] = useState<{
    success: boolean;
    message: string;
    riskLevel?: string;
  } | null>(null);

  if (!isSimulatorOpen) return null;

  // Real-time live preview evaluation of the form fields
  const previewEval = evaluateRisk(
    {
      deviceId: selectedDevice,
      rainfall: parseFloat(rainfall) || 0,
      rainfall24h: parseFloat(rainfall24h) || 0,
      soilMoisture: parseFloat(soilMoisture) || 0,
      tilt: parseFloat(tilt) || 0,
      vibration: parseFloat(vibration) || 0,
    },
    thresholds
  );

  const previewValidation = validateSensorInput({
    deviceId: selectedDevice,
    rainfall: parseFloat(rainfall),
    rainfall24h: parseFloat(rainfall24h),
    soilMoisture: parseFloat(soilMoisture),
    tilt: parseFloat(tilt),
    vibration: parseFloat(vibration),
    temperature: parseFloat(temperature),
    humidity: parseFloat(humidity),
  });

  // Presets
  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'baseline':
        setRainfall('4.2');
        setRainfall24h('18.0');
        setSoilMoisture('42.0');
        setTilt('0.25');
        setVibration('0.04');
        break;
      case 'moderate':
        setRainfall('28.5');
        setRainfall24h('88.0');
        setSoilMoisture('74.5');
        setTilt('1.65');
        setVibration('0.18');
        break;
      case 'high_hazard':
        setRainfall('52.0');
        setRainfall24h('158.0');
        setSoilMoisture('88.4');
        setTilt('3.95');
        setVibration('0.48');
        break;
      case 'seismic_shock':
        setRainfall('14.0');
        setRainfall24h('65.0');
        setSoilMoisture('78.0');
        setTilt('2.80');
        setVibration('0.78');
        break;
      case 'anomalous':
        setRainfall('395.0'); // Exceeds physical meteorological threshold
        setSoilMoisture('92.0');
        setTilt('1.1');
        setVibration('0.1');
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultFeedback(null);

    if (!previewValidation.isValid) {
      setResultFeedback({
        success: false,
        message: `Validation Error: ${previewValidation.errors.join(', ')}`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitReading({
        deviceId: selectedDevice,
        rainfall: parseFloat(rainfall),
        rainfall24h: parseFloat(rainfall24h),
        soilMoisture: parseFloat(soilMoisture),
        tilt: parseFloat(tilt),
        vibration: parseFloat(vibration),
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        source: 'SIMULATED',
      });

      setResultFeedback({
        success: true,
        message: `Reading submitted for ${selectedDevice}. Risk Engine evaluated: ${response.assessment.riskLevel}. ${
          response.alert ? `Life-Safety Alert generated: ${response.alert.severity}!` : 'No alert triggered.'
        }`,
        riskLevel: response.assessment.riskLevel,
      });

      // Auto-close after 2.5s on success
      setTimeout(() => {
        setIsSimulatorOpen(false);
      }, 2500);
    } catch (err: any) {
      setResultFeedback({
        success: false,
        message: err.message || 'Failed to submit telemetry reading.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#0c1324',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          padding: '1.75rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FlaskConical size={20} color="#c084fc" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Controlled Telemetry Simulator
              </h3>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                }}
              >
                SIMULATED DATA ONLY
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              Test deterministic risk analysis rules and life-safety alerts without physical sensor hardware.
            </p>
          </div>
          <button
            onClick={() => setIsSimulatorOpen(false)}
            style={{ color: '#64748b', padding: '0.4rem', borderRadius: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Target Node Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.35rem' }}>
            Target Geotechnical Telemetry Node
          </label>
          <select
            value={selectedDevice}
            onChange={e => setSelectedDevice(e.target.value)}
            style={{ width: '100%' }}
          >
            {devices.map(d => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.deviceId} — {d.name} ({d.locationLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Scenario Presets */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Scenario Quick Presets:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button type="button" onClick={() => applyPreset('baseline')} className="btn btn-secondary btn-sm">
              Normal Baseline (Low)
            </button>
            <button type="button" onClick={() => applyPreset('moderate')} className="btn btn-secondary btn-sm" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              Heavy Rain (Moderate)
            </button>
            <button type="button" onClick={() => applyPreset('high_hazard')} className="btn btn-secondary btn-sm" style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fb7185' }}>
              Monsoon + Saturated Creep (High Hazard)
            </button>
            <button type="button" onClick={() => applyPreset('seismic_shock')} className="btn btn-secondary btn-sm">
              Seismic Dynamic Shock
            </button>
            <button type="button" onClick={() => applyPreset('anomalous')} className="btn btn-secondary btn-sm" style={{ color: '#f87171' }}>
              Implausible Telemetry Check
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Peak Rainfall Rate (mm/h)
              </label>
              <input
                type="number"
                step="0.1"
                value={rainfall}
                onChange={e => setRainfall(e.target.value)}
                style={{ width: '100%' }}
                required
              />
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Mod: &ge; {thresholds.rainfallRateMod} | High: &ge; {thresholds.rainfallRateHigh}</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                24h Cumulative Rain (mm)
              </label>
              <input
                type="number"
                step="0.5"
                value={rainfall24h}
                onChange={e => setRainfall24h(e.target.value)}
                style={{ width: '100%' }}
                required
              />
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Mod: &ge; {thresholds.rainfall24hMod} | High: &ge; {thresholds.rainfall24hHigh}</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Soil Moisture Saturation (% VWC)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={e => setSoilMoisture(e.target.value)}
                style={{ width: '100%' }}
                required
              />
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Mod: &ge; {thresholds.soilMoistureMod} | High: &ge; {thresholds.soilMoistureHigh}</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Ground Inclinometer Tilt (°)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="90"
                value={tilt}
                onChange={e => setTilt(e.target.value)}
                style={{ width: '100%' }}
                required
              />
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Mod: &ge; {thresholds.tiltMod} | High: &ge; {thresholds.tiltHigh}</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Peak Ground Acceleration (g)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={vibration}
                onChange={e => setVibration(e.target.value)}
                style={{ width: '100%' }}
                required
              />
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Mod: &ge; {thresholds.vibrationMod} | High: &ge; {thresholds.vibrationHigh}</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                Ambient Temp (°C) &amp; Humidity (%)
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={e => setTemperature(e.target.value)}
                  style={{ width: '50%' }}
                  title="Temperature in Celsius"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={humidity}
                  onChange={e => setHumidity(e.target.value)}
                  style={{ width: '50%' }}
                  title="Relative Humidity %"
                />
              </div>
            </div>
          </div>

          {/* Real-time Rule Prediction Preview Box */}
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>
                Deterministic Rule Engine Real-Time Forecast:
              </span>
              <RiskBadge level={previewEval.riskLevel} size="sm" />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              {previewEval.reason}
            </p>
            {previewValidation.isImplausible && (
              <div style={{ marginTop: '0.4rem', color: '#f87171', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertTriangle size={13} />
                <span>Anomalous: {previewValidation.implausibleReason}</span>
              </div>
            )}
          </div>

          {/* Feedback message */}
          {resultFeedback && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                backgroundColor: resultFeedback.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${resultFeedback.success ? '#10b981' : '#ef4444'}`,
                color: resultFeedback.success ? '#34d399' : '#f87171',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {resultFeedback.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{resultFeedback.message}</span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Destination: {environmentStatus.mode}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsSimulatorOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !previewValidation.isValid}
                className="btn btn-primary btn-sm"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #0284c7 100%)' }}
              >
                <Send size={14} />
                {isSubmitting ? 'Evaluating & Ingesting...' : 'Dispatch Telemetry Reading'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
