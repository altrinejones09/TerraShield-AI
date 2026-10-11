import React from 'react';
import type { RiskLevel } from '../../types/telemetry';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showPulse = true }) => {
  const getStyles = () => {
    switch (level) {
      case 'HIGH':
        return {
          bg: 'rgba(244, 63, 94, 0.14)',
          border: 'rgba(244, 63, 94, 0.45)',
          text: '#fb7185',
          dot: '#f43f5e',
          label: 'HIGH HAZARD',
        };
      case 'MODERATE':
        return {
          bg: 'rgba(245, 158, 11, 0.14)',
          border: 'rgba(245, 158, 11, 0.45)',
          text: '#fbbf24',
          dot: '#f59e0b',
          label: 'MODERATE RISK',
        };
      case 'LOW':
      default:
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.35)',
          text: '#34d399',
          dot: '#10b981',
          label: 'LOW RISK',
        };
    }
  };

  const style = getStyles();
  const padding = size === 'sm' ? '0.2rem 0.5rem' : size === 'lg' ? '0.5rem 1rem' : '0.3rem 0.75rem';
  const fontSize = size === 'sm' ? '0.7rem' : size === 'lg' ? '0.875rem' : '0.775rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding,
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.04em',
        borderRadius: '9999px',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
      }}
    >
      <span
        style={{
          width: size === 'sm' ? '6px' : '8px',
          height: size === 'sm' ? '6px' : '8px',
          borderRadius: '50%',
          backgroundColor: style.dot,
          boxShadow: showPulse && level !== 'LOW' ? `0 0 10px ${style.dot}` : 'none',
        }}
      />
      {style.label}
    </span>
  );
};
