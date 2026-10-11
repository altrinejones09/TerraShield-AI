import React, { useState } from 'react';
import {
  User,
  Bell,
  Sliders,
  Cloud,
  RotateCcw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Server,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTelemetry } from '../../context/TelemetryContext';
import type { RiskThresholdConfig } from '../../types/telemetry';

export const SettingsView: React.FC = () => {
  const { user, logout, updateUserPreferences, cognitoEnabled } = useAuth();
  const {
    thresholds,
    updateThresholds,
    resetAllDemoData,
    environmentStatus,
  } = useTelemetry();

  // Threshold form state
  const [formThresholds, setFormThresholds] = useState<RiskThresholdConfig>({ ...thresholds });
  const [thresholdSaved, setThresholdSaved] = useState(false);

  // Notification preferences
  const [emailAlerts, setEmailAlerts] = useState(user?.notificationPreferences.emailAlerts ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.notificationPreferences.smsAlerts ?? true);
  const [emergencyBroadcast, setEmergencyBroadcast] = useState(
    user?.notificationPreferences.emergencyBroadcastAlerts ?? true
  );
  const [highRiskOnly, setHighRiskOnly] = useState(user?.notificationPreferences.highRiskOnly ?? false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds(formThresholds);
    setThresholdSaved(true);
    setTimeout(() => setThresholdSaved(false), 3000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserPreferences({
      emailAlerts,
      smsAlerts,
      emergencyBroadcastAlerts: emergencyBroadcast,
      highRiskOnly,
    });
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1100px' }}>
      {/* Header */}
      <div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
          Platform Settings &amp; Configuration
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Tune deterministic risk thresholds, notification pipelines, and view cloud infrastructure connectivity
        </p>
      </div>

      {/* 1. Configurable Risk Thresholds */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Sliders size={20} color="#0ea5e9" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              Configurable Geotechnical Risk Thresholds
            </h4>
          </div>

          {thresholdSaved && (
            <span style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={16} /> Saved Successfully
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Modifying these values dynamically adjusts the deterministic rule engine calculations across all monitored telemetry nodes.
        </p>

        <form onSubmit={handleSaveThresholds}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Peak Rain Rate Moderate (mm/h)
              </label>
              <input
                type="number"
                step="0.5"
                value={formThresholds.rainfallRateMod}
                onChange={e => setFormThresholds({ ...formThresholds, rainfallRateMod: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Peak Rain Rate High (mm/h)
              </label>
              <input
                type="number"
                step="0.5"
                value={formThresholds.rainfallRateHigh}
                onChange={e => setFormThresholds({ ...formThresholds, rainfallRateHigh: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Soil Moisture Moderate (% VWC)
              </label>
              <input
                type="number"
                step="0.5"
                value={formThresholds.soilMoistureMod}
                onChange={e => setFormThresholds({ ...formThresholds, soilMoistureMod: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Soil Moisture High (% VWC)
              </label>
              <input
                type="number"
                step="0.5"
                value={formThresholds.soilMoistureHigh}
                onChange={e => setFormThresholds({ ...formThresholds, soilMoistureHigh: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Inclinometer Tilt Moderate (°)
              </label>
              <input
                type="number"
                step="0.1"
                value={formThresholds.tiltMod}
                onChange={e => setFormThresholds({ ...formThresholds, tiltMod: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Inclinometer Tilt High (°)
              </label>
              <input
                type="number"
                step="0.1"
                value={formThresholds.tiltHigh}
                onChange={e => setFormThresholds({ ...formThresholds, tiltHigh: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Vibration PPA Moderate (g)
              </label>
              <input
                type="number"
                step="0.05"
                value={formThresholds.vibrationMod}
                onChange={e => setFormThresholds({ ...formThresholds, vibrationMod: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                Vibration PPA High (g)
              </label>
              <input
                type="number"
                step="0.05"
                value={formThresholds.vibrationHigh}
                onChange={e => setFormThresholds({ ...formThresholds, vibrationHigh: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            <Save size={15} /> Save Risk Thresholds
          </button>
        </form>
      </div>

      {/* 2. User Profile & Notification Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* User Profile */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <User size={18} color="#2dd4bf" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
              Analyst Profile
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.825rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Name</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{user?.name || 'Elena Rostova, P.E.'}</span>
            </div>

            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Email</span>
              <span style={{ color: '#cbd5e1' }}>{user?.email || 'analyst@terrashield.internal'}</span>
            </div>

            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Organization</span>
              <span style={{ color: '#cbd5e1' }}>{user?.organization || 'Geological Hazard Mitigation Authority'}</span>
            </div>

            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>System Role</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>{user?.role || 'GEOTECHNICAL_ANALYST'}</span>
            </div>

            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Time Zone</span>
              <span style={{ color: '#cbd5e1' }}>{user?.timeZone || 'UTC+05:30 (Asia/Kolkata)'}</span>
            </div>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <button
                className="btn btn-danger btn-sm"
                onClick={logout}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogOut size={14} /> Sign Out of Workspace
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} color="#fbbf24" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                Notification Channels
              </h4>
            </div>
            {prefsSaved && <span style={{ color: '#10b981', fontSize: '0.75rem' }}>Saved!</span>}
          </div>

          <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <div>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', display: 'block' }}>Email Incident Alerts</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Receive instant analytical breach summaries</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={e => setSmsAlerts(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <div>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', display: 'block' }}>SMS Priority Alerts</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>High-priority text dispatch for critical hazards</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={emergencyBroadcast}
                onChange={e => setEmergencyBroadcast(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <div>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', display: 'block' }}>Civil Defense Broadcast Webhook</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Relay high alerts to emergency response agencies</span>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={highRiskOnly}
                onChange={e => setHighRiskOnly(e.target.checked)}
                style={{ marginTop: '3px' }}
              />
              <div>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', display: 'block' }}>High-Risk Events Only</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Suppress advisory and moderate notifications</span>
              </div>
            </label>

            <button type="submit" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
              Update Preferences
            </button>
          </form>
        </div>
      </div>

      {/* 3. AWS Infrastructure Connectivity Status */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Server size={18} color="#0ea5e9" />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
            AWS Cloud Integration Status
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '0.85rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>Amazon API Gateway / REST</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: environmentStatus.isBackendReachable ? '#10b981' : '#c084fc' }}>
              {environmentStatus.isBackendReachable ? 'Connected' : 'Local Browser Store'}
            </span>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.2rem' }}>
              Endpoint: {environmentStatus.apiBaseUrl}
            </div>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>Amazon DynamoDB</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: environmentStatus.dynamoConnected ? '#10b981' : '#c084fc' }}>
              {environmentStatus.dynamoConnected ? 'AWS Connected' : 'Simulated In-Memory Store'}
            </span>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.2rem' }}>
              Tables: Telemetry, Devices, Alerts
            </div>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>Amazon Cognito User Pool</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: cognitoEnabled ? '#10b981' : '#c084fc' }}>
              {cognitoEnabled ? 'Cognito User Pool Active' : 'Local Demo Auth Provider'}
            </span>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.2rem' }}>
              Token: JWT Bearer Verification
            </div>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
            <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>AWS IoT Core (MQTT)</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
              Hardware Standby
            </span>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.2rem' }}>
              Topic: terrashield/nodes/+/telemetry
            </div>
          </div>
        </div>

        {/* Reset Demo Data Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', display: 'block' }}>
              Reset Demonstration State
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Restore original deterministic test stations, 24h storm readings, and alerts.
            </span>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={resetAllDemoData}
            title="Reset demo data to default deterministic values"
          >
            <RotateCcw size={14} /> Reset Demonstration Store
          </button>
        </div>
      </div>
    </div>
  );
};
