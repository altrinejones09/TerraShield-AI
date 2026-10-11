import React from 'react';
import {
  Activity,
  Gauge,
  ShieldAlert,
  Bell,
  Cpu,
  LineChart,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

interface AppSidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { alerts, devices, environmentStatus } = useTelemetry();

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: Activity },
    { id: 'sensors', label: 'Sensor Monitoring', icon: Gauge },
    { id: 'risk', label: 'Risk Analysis', icon: ShieldAlert },
    {
      id: 'alerts',
      label: 'Alerts Centre',
      icon: Bell,
      badge: unacknowledgedAlerts > 0 ? unacknowledgedAlerts : undefined,
      badgeColor: '#f43f5e',
    },
    {
      id: 'devices',
      label: 'Device Management',
      icon: Cpu,
      badge: devices.length,
      badgeColor: '#0ea5e9',
    },
    { id: 'analytics', label: 'Historical Analytics', icon: LineChart },
    { id: 'settings', label: 'Settings & Profile', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 10, 20, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
          }}
        />
      )}

      <aside
        className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
        aria-label="Workspace Navigation"
        style={{
          width: collapsed ? '72px' : 'var(--sidebar-width)',
          backgroundColor: '#090e1c',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 40,
        }}
      >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0' : '0 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Shield size={18} color="#ffffff" />
          </div>
          {!collapsed && (
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', display: 'block' }}>
                TerraShield AI
              </span>
              <span style={{ fontSize: '0.62rem', color: '#64748b', display: 'block', lineHeight: 1 }}>
                Geotechnical Telemetry
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {onCloseMobile && (
              <button
                className="mobile-close-btn"
                onClick={onCloseMobile}
                style={{
                  color: '#94a3b8',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label="Close Mobile Navigation"
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={onToggleCollapse}
              style={{
                color: '#64748b',
                padding: '0.35rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: collapsed ? '0.75rem 0' : '0.65rem 0.85rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#f8fafc' : '#94a3b8',
                backgroundColor: isActive ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(14, 165, 233, 0.35)' : '1px solid transparent',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} color={isActive ? '#38bdf8' : '#64748b'} />
              {!collapsed && (
                <>
                  <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span
                      style={{
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: item.badgeColor ? `${item.badgeColor}22` : 'rgba(255, 255, 255, 0.1)',
                        color: item.badgeColor || '#cbd5e1',
                        border: `1px solid ${item.badgeColor ? `${item.badgeColor}44` : 'transparent'}`,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Expand Button when collapsed */}
      {collapsed && (
        <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onToggleCollapse}
            style={{ color: '#64748b', padding: '0.4rem', borderRadius: '6px' }}
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Bottom Environment Status */}
      {!collapsed && (
        <div
          style={{
            margin: '0.75rem',
            padding: '0.85rem',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
              Environment
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: environmentStatus.mode === 'AWS_CLOUD' ? '#34d399' : '#c084fc',
              }}
            >
              {environmentStatus.mode}
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3 }}>
            {environmentStatus.mode === 'AWS_CLOUD'
              ? 'Connected to Amazon API Gateway & DynamoDB.'
              : 'Deterministic in-browser demonstration store.'}
          </div>
        </div>
      )}
      </aside>
    </>
  );
};
