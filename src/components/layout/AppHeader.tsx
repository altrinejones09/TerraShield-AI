import React from 'react';
import {
  RefreshCw,
  FlaskConical,
  LogOut,
  User,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTelemetry } from '../../context/TelemetryContext';
import { StatusPill } from '../common/StatusPill';

interface AppHeaderProps {
  currentViewTitle: string;
  onNavigateHome: () => void;
  onToggleMobileSidebar?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentViewTitle,
  onNavigateHome,
  onToggleMobileSidebar,
}) => {
  const { user, logout } = useAuth();
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    refreshAll,
    isLoading,
    setIsSimulatorOpen,
    lastUpdated,
  } = useTelemetry();

  return (
    <header
      style={{
        minHeight: 'var(--header-height)',
        backgroundColor: '#0a0f1d',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}
    >
      {/* Left: Mobile Toggle + Breadcrumbs & View Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="mobile-menu-btn"
            style={{
              padding: '0.4rem',
              color: '#94a3b8',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Toggle workspace navigation menu"
          >
            <Menu size={18} />
          </button>
        )}

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#64748b' }}>
            <span
              onClick={onNavigateHome}
              style={{ cursor: 'pointer', color: '#38bdf8' }}
              title="Return to Public Marketing Portal"
            >
              TerraShield
            </span>
            <span>/</span>
            <span>Workspace</span>
            <span>/</span>
            <span style={{ color: '#94a3b8' }}>{currentViewTitle}</span>
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', marginTop: '0.1rem', margin: 0 }}>
            {currentViewTitle}
          </h2>
        </div>

        {/* Global Node Filter Dropdown */}
        <div style={{ marginLeft: '0.5rem' }}>
          <select
            value={selectedDeviceId}
            onChange={e => setSelectedDeviceId(e.target.value)}
            aria-label="Filter monitored sectors by telemetry node"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.8rem',
              backgroundColor: 'rgba(22, 32, 56, 0.85)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              cursor: 'pointer',
              maxWidth: '240px',
            }}
          >
            <option value="ALL">All Monitored Sectors ({devices.length} Nodes)</option>
            {devices.map(d => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.deviceId} — {d.name} ({d.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
        {/* Source Badge */}
        <StatusPill type="data-source" value="SIMULATED" size="sm" />

        {/* Test Reading Simulator Trigger */}
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setIsSimulatorOpen(true)}
          style={{
            borderColor: 'rgba(168, 85, 247, 0.45)',
            color: '#c084fc',
            background: 'rgba(168, 85, 247, 0.08)',
          }}
          title="Inject a test reading to trigger deterministic risk engine rules"
        >
          <FlaskConical size={14} />
          <span>Inject Test</span>
        </button>

        {/* Manual Refresh */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={refreshAll}
          disabled={isLoading}
          title={`Last updated: ${new Date(lastUpdated).toLocaleTimeString()}`}
        >
          <RefreshCw size={13} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          <span>Refresh</span>
        </button>

        {/* User Card & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(14, 165, 233, 0.15)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <User size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.1 }}>
              {user ? user.name : 'Guest Analyst'}
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
              {user?.role ? user.role.replace('_', ' ') : 'DEMO OBSERVER'}
            </span>
          </div>

          <button
            onClick={logout}
            style={{
              padding: '0.4rem',
              color: '#64748b',
              borderRadius: '6px',
              transition: 'color 0.15s ease',
            }}
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
