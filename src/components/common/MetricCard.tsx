import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  secondaryValue?: string;
  icon: React.ReactNode;
  thresholdMod?: number;
  thresholdHigh?: number;
  currentNum?: number;
  maxScale?: number;
  isImplausible?: boolean;
  implausibleReason?: string;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  secondaryValue,
  icon,
  thresholdMod,
  thresholdHigh,
  currentNum,
  maxScale = 100,
  isImplausible,
  implausibleReason,
  subtitle,
}) => {
  // Determine danger status
  const num = currentNum !== undefined ? currentNum : Number(value);
  const isHigh = thresholdHigh !== undefined && num >= thresholdHigh;
  const isMod = !isHigh && thresholdMod !== undefined && num >= thresholdMod;

  const valueColor = isHigh ? '#fb7185' : isMod ? '#fbbf24' : '#f8fafc';
  const progressPercent = Math.min(100, Math.max(0, (num / maxScale) * 100));
  const barColor = isHigh ? '#f43f5e' : isMod ? '#f59e0b' : '#0ea5e9';

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: isHigh ? '3px solid #f43f5e' : isMod ? '3px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </span>
          {subtitle && (
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>{subtitle}</div>
          )}
        </div>
        <div
          style={{
            padding: '0.5rem',
            borderRadius: '8px',
            backgroundColor: isHigh ? 'rgba(244, 63, 94, 0.12)' : isMod ? 'rgba(245, 158, 11, 0.12)' : 'rgba(14, 165, 233, 0.1)',
            color: isHigh ? '#fb7185' : isMod ? '#fbbf24' : '#38bdf8',
          }}
        >
          {icon}
        </div>
      </div>

      {/* Primary Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.25rem 0' }}>
        <span
          className="mono-num"
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: valueColor,
            lineHeight: 1.1,
          }}
        >
          {value}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>
          {unit}
        </span>
      </div>

      {/* Threshold Progress Bar if applicable */}
      {thresholdMod !== undefined && (
        <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            role="progressbar"
            aria-valuenow={num}
            aria-valuemin={0}
            aria-valuemax={maxScale}
            aria-label={`${title} reading: ${value} ${unit}`}
            style={{
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: barColor,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', fontSize: '0.68rem', color: '#64748b' }}>
            <span>0</span>
            <span style={{ color: isMod ? '#fbbf24' : '#64748b' }}>Mod: {thresholdMod}{unit}</span>
            <span style={{ color: isHigh ? '#fb7185' : '#64748b' }}>High: {thresholdHigh}{unit}</span>
          </div>
        </div>
      )}

      {/* Secondary Info / Anomalies */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        {secondaryValue && (
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {secondaryValue}
          </span>
        )}
        {isImplausible && (
          <span
            title={implausibleReason}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#f87171',
              fontSize: '0.68rem',
              fontWeight: 600,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
            }}
          >
            <AlertTriangle size={12} />
            Implausible Check
          </span>
        )}
      </div>
    </div>
  );
};
