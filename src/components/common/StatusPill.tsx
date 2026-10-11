import React from 'react';
import type { DeviceStatus, DataSource } from '../../types/telemetry';

interface StatusPillProps {
  type: 'device-status' | 'data-source' | 'data-mode';
  value: DeviceStatus | DataSource | string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ type, value, size = 'sm' }) => {
  const getStyling = () => {
    if (type === 'device-status') {
      switch (value) {
        case 'ONLINE':
          return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#34d399', dot: '#10b981', label: 'ONLINE' };
        case 'STALE':
          return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#fbbf24', dot: '#f59e0b', label: 'STALE' };
        case 'OFFLINE':
        default:
          return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171', dot: '#ef4444', label: 'OFFLINE' };
      }
    }

    if (type === 'data-source') {
      if (value === 'SIMULATED') {
        return { bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.35)', text: '#c084fc', dot: '#a855f7', label: 'SIMULATED' };
      }
      return { bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.35)', text: '#22d3ee', dot: '#06b6d4', label: 'HARDWARE' };
    }

    // data-mode
    return { bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.25)', text: '#cbd5e1', dot: '#94a3b8', label: String(value) };
  };

  const style = getStyling();
  const padding = size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.7rem';
  const fontSize = size === 'sm' ? '0.68rem' : '0.75rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding,
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.04em',
        borderRadius: '9999px',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: style.dot,
        }}
      />
      {style.label}
    </span>
  );
};
