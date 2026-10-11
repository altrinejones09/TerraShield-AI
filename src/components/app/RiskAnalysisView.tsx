import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { RiskBadge } from '../common/RiskBadge';
import { RadarRiskIndicator } from '../common/RadarRiskIndicator';

export const RiskAnalysisView: React.FC = () => {
  const {
    currentAssessments,
    selectedDeviceId,
    devices,
  } = useTelemetry();

  const activeAssessment =
    selectedDeviceId === 'ALL'
      ? currentAssessments[0]
      : currentAssessments.find(a => a.deviceId === selectedDeviceId) || currentAssessments[0];

  const activeDevice =
    activeAssessment && devices.find(d => d.deviceId === activeAssessment.deviceId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Current Transparent Rule Engine Result Header */}
      {activeAssessment && (
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            borderLeft:
              activeAssessment.riskLevel === 'HIGH'
                ? '5px solid #f43f5e'
                : activeAssessment.riskLevel === 'MODERATE'
                ? '5px solid #f59e0b'
                : '5px solid #10b981',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <RiskBadge level={activeAssessment.riskLevel} size="lg" />
                <span
                  style={{
                    fontSize: '0.72rem',
                    backgroundColor: 'rgba(14, 165, 233, 0.15)',
                    color: '#38bdf8',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    fontWeight: 700,
                  }}
                >
                  {activeAssessment.engineVersion}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Timestamp: {new Date(activeAssessment.timestamp).toLocaleString()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                {activeDevice ? activeDevice.name : activeAssessment.deviceId} — Geotechnical Stability Evaluation
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {activeDevice?.locationLabel} &bull; Geotechnical Slope Angle: {activeDevice?.slopeAngle || 42}°
              </p>
            </div>

            <RadarRiskIndicator
              overallScore={activeAssessment.overallScore}
              rainfallScore={activeAssessment.factors.rainfallScore}
              soilMoistureScore={activeAssessment.factors.soilMoistureScore}
              tiltScore={activeAssessment.factors.tiltScore}
              vibrationScore={activeAssessment.factors.vibrationScore}
              size={180}
            />
          </div>

          {/* Full Plain-English Reason Synthesis */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '10px',
              marginBottom: '1.5rem',
            }}
          >
            <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Synthesized Evaluation Explanation:
            </h5>
            <p style={{ fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.6, margin: 0 }}>
              {activeAssessment.reason}
            </p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={16} />
              <span>Recommended Protocol: {activeAssessment.recommendedAction}</span>
            </div>
          </div>

          {/* Contributing Measurements & Threshold Breaches Table */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
              Threshold Crossing Breakdown
            </h4>

            {activeAssessment.thresholdsCrossed.length === 0 ? (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>All geotechnical parameters remain within safe baseline limits. No thresholds breached.</span>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Contributing Sensor Metric</th>
                      <th>Measured Telemetry</th>
                      <th>Configured Threshold</th>
                      <th>Breach Severity</th>
                      <th>Geotechnical Consequence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeAssessment.thresholdsCrossed.map((tc, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: '#f8fafc' }}>{tc.label}</td>
                        <td className="mono-num" style={{ fontWeight: 700, color: tc.severity === 'HIGH' ? '#fb7185' : '#fbbf24' }}>
                          {tc.value} {tc.unit}
                        </td>
                        <td className="mono-num" style={{ color: '#94a3b8' }}>
                          &ge; {tc.threshold} {tc.unit}
                        </td>
                        <td>
                          <span
                            style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              backgroundColor: tc.severity === 'HIGH' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: tc.severity === 'HIGH' ? '#fb7185' : '#fbbf24',
                              border: `1px solid ${tc.severity === 'HIGH' ? 'rgba(244, 63, 94, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                            }}
                          >
                            {tc.severity} BREACH
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                          {tc.metric === 'soilMoisture' && 'Soil pore-water pressure near saturation; drastic loss in effective shear strength.'}
                          {tc.metric === 'tilt' && 'Active angular displacement indicating active slip surface deformation.'}
                          {tc.metric === 'rainfallRate' && 'High-intensity deluge saturating shallow colluvium soil layers.'}
                          {tc.metric === 'rainfall24h' && 'High cumulative antecedent hydrological load.'}
                          {tc.metric === 'vibration' && 'Dynamic seismic acceleration destabilizing slope equilibrium.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* XGBoost Machine Learning Future Integration Slot */}
      <div
        className="glass-panel"
        style={{
          padding: '1.75rem',
          backgroundColor: '#0a1020',
          border: '1px solid rgba(168, 85, 247, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <Sparkles size={20} color="#c084fc" />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            Machine Learning (XGBoost) Integration Slot
          </h4>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
            }}
          >
            STANDBY &bull; FIELD VALIDATION PENDING
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
          The architecture features a decoupled, modular inference adapter ready for Amazon SageMaker or ONNX-compiled XGBoost models. To uphold life-safety integrity, <strong>machine-learning predictions are intentionally disabled</strong> until multi-year geotechnical soil calibration datasets and real-world slope stability cross-validations have been completed.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.8rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
            <span style={{ color: '#64748b', display: 'block' }}>Interface Identifier:</span>
            <span style={{ color: '#cbd5e1', fontWeight: 600 }}>xgboost-landslide-v2-adapter</span>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
            <span style={{ color: '#64748b', display: 'block' }}>Active Fallback:</span>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>Deterministic Geotechnical Heuristics</span>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
            <span style={{ color: '#64748b', display: 'block' }}>Field Training Status:</span>
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Zero Fabricated Weights Committed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
