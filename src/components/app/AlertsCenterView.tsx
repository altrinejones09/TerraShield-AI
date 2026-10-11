import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Clock,
  User,
  FileText,
  Search,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { useAuth } from '../../context/AuthContext';
import { StatusPill } from '../common/StatusPill';

export const AlertsCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert } = useTelemetry();
  const { user } = useAuth();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'ADVISORY'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNACKNOWLEDGED' | 'ACKNOWLEDGED'>('ALL');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmittingAck, setIsSubmittingAck] = useState(false);

  // Filter alerts
  const filteredAlerts = alerts.filter(a => {
    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'UNACKNOWLEDGED' && !a.acknowledged) ||
      (statusFilter === 'ACKNOWLEDGED' && a.acknowledged);
    return matchesSeverity && matchesStatus;
  });

  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || filteredAlerts[0] || null;

  const handleAcknowledge = async (alertId: string) => {
    setIsSubmittingAck(true);
    try {
      await acknowledgeAlert(
        alertId,
        actionNotes.trim() || `Confirmed by ${user?.name || 'Duty Analyst'}. Field investigation dispatched.`
      );
      setActionNotes('');
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    } finally {
      setIsSubmittingAck(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Prominent Official Directive Notice */}
      <div className="disclaimer-banner">
        <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>CIVIL DEFENSE &amp; LIFE-SAFETY DIRECTIVE:</strong> Alerts displayed here represent analytical geotechnical thresholds. In all potential mass-wasting events, follow directives issued directly by official local disaster management authorities (NDMA, USGS, Civil Defense, BMKG).
        </div>
      </div>

      {/* Filter Controls Header */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
            Life-Safety Alerts Centre ({filteredAlerts.length} Active / Logged)
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Audit trail of threshold breaches, slope creep notices, and operational acknowledgements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value as any)}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="WARNING">Warning Only</option>
            <option value="ADVISORY">Advisory Only</option>
          </select>

          {/* Acknowledged status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="UNACKNOWLEDGED">Unacknowledged Only</option>
            <option value="ACKNOWLEDGED">Acknowledged Only</option>
          </select>
        </div>
      </div>

      {/* Main Alert Feed & Details Drawer Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredAlerts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', color: '#64748b' }}>
              <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 700 }}>No Alerts Found</h4>
              <p style={{ fontSize: '0.85rem' }}>There are currently no alerts matching your active filter criteria.</p>
            </div>
          ) : (
            filteredAlerts.map(alt => {
              const isSelected = selectedAlert?.id === alt.id;
              const borderCol =
                alt.severity === 'CRITICAL'
                  ? '#f43f5e'
                  : alt.severity === 'WARNING'
                  ? '#f59e0b'
                  : '#38bdf8';

              return (
                <div
                  key={alt.id}
                  onClick={() => setSelectedAlertId(alt.id)}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    borderLeft: `4px solid ${borderCol}`,
                    backgroundColor: isSelected ? 'rgba(22, 32, 56, 0.85)' : 'var(--glass-bg)',
                    borderColor: isSelected ? 'rgba(14, 165, 233, 0.4)' : undefined,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: `${borderCol}18`,
                          color: borderCol,
                          border: `1px solid ${borderCol}44`,
                        }}
                      >
                        {alt.severity}
                      </span>
                      <StatusPill type="data-source" value={alt.source} size="sm" />
                    </div>

                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {new Date(alt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                    {alt.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {alt.message}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                    <span>Node: <strong>{alt.deviceName}</strong></span>
                    {alt.acknowledged ? (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle2 size={13} /> Acknowledged
                      </span>
                    ) : (
                      <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                        &bull; Pending Confirmation
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Alert Details & Acknowledgment Form */}
        {selectedAlert && (
          <div
            className="glass-panel"
            style={{
              padding: '1.75rem',
              backgroundColor: '#0c1324',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    backgroundColor:
                      selectedAlert.severity === 'CRITICAL'
                        ? 'rgba(244, 63, 94, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                    color: selectedAlert.severity === 'CRITICAL' ? '#fb7185' : '#fbbf24',
                  }}
                >
                  {selectedAlert.severity} ADVISORY
                </span>
                <span className="mono-num" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {selectedAlert.id}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                {selectedAlert.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {selectedAlert.location} &bull; Node: {selectedAlert.deviceName}
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Contributing Breaches:
              </span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {selectedAlert.contributingFactors.map((f, i) => (
                  <li key={i} style={{ fontSize: '0.8rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    &bull; {f}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <strong>Description:</strong> {selectedAlert.message}
            </div>

            {/* Acknowledgment Status or Form */}
            {selectedAlert.acknowledged ? (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Acknowledged &amp; Logged to Ledger</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  <strong>Officer:</strong> {selectedAlert.acknowledgedBy}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  <strong>Timestamp:</strong> {new Date(selectedAlert.acknowledgedAt!).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  <strong>Action Logged:</strong> {selectedAlert.actionTaken}
                </div>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Operator Acknowledgment Workflow
                </h5>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                  Confirm receipt of this hazard condition and record field verification actions taken.
                </p>

                <textarea
                  rows={3}
                  placeholder="e.g. Verified inclinometer deflection with local road maintenance crew; alerted disaster division."
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  style={{ width: '100%', marginBottom: '0.85rem' }}
                />

                <button
                  className="btn btn-primary btn-sm"
                  disabled={isSubmittingAck}
                  onClick={() => handleAcknowledge(selectedAlert.id)}
                  style={{ width: '100%', padding: '0.7rem' }}
                >
                  <ShieldCheck size={16} />
                  {isSubmittingAck ? 'Recording Confirmation...' : 'Confirm & Acknowledge Alert'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
