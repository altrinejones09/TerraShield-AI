import React, { useState } from 'react';

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  unit: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  [key: string]: any;
}

interface TimeSeriesChartProps {
  title: string;
  subtitle?: string;
  data: TimeSeriesPoint[];
  series: ChartSeries[];
  thresholdMod?: number;
  thresholdHigh?: number;
  height?: number;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  title,
  subtitle,
  data,
  series,
  thresholdMod,
  thresholdHigh,
  height = 240,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No telemetry data points available in the selected range.</p>
      </div>
    );
  }

  // Calculate global min and max for all active series
  let minVal = 0;
  let maxVal = 10;
  series.forEach(s => {
    data.forEach(d => {
      const v = Number(d[s.key] ?? 0);
      if (v > maxVal) maxVal = v;
    });
  });

  if (thresholdHigh && thresholdHigh > maxVal) {
    maxVal = thresholdHigh * 1.1;
  } else {
    maxVal = maxVal * 1.15; // add 15% headroom
  }

  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;
  const viewWidth = 680;
  const plotWidth = viewWidth - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + plotWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * plotWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const ratio = (clamped - minVal) / (maxVal - minVal || 1);
    return paddingTop + plotHeight - ratio * plotHeight;
  };

  // Build SVG path strings
  const paths = series.map(s => {
    const points = data.map((d, i) => `${getX(i).toFixed(1)},${getY(Number(d[s.key] ?? 0)).toFixed(1)}`);
    const linePath = `M ${points.join(' L ')}`;

    // Area fill path
    const firstX = getX(0).toFixed(1);
    const lastX = getX(data.length - 1).toFixed(1);
    const bottomY = (paddingTop + plotHeight).toFixed(1);
    const areaPath = `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;

    return { ...s, linePath, areaPath };
  });

  const activePoint = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < data.length ? data[hoverIndex] : null;

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '';
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{title}</h4>
          {subtitle && <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{subtitle}</p>}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {series.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span style={{ width: '10px', height: '3px', backgroundColor: s.color, borderRadius: '2px' }} />
              <span>{s.label}</span>
            </div>
          ))}
          {thresholdMod !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#fbbf24' }}>
              <span style={{ width: '10px', height: '2px', backgroundColor: '#f59e0b', borderTop: '1px dashed #f59e0b' }} />
              <span>Mod ({thresholdMod})</span>
            </div>
          )}
          {thresholdHigh !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#fb7185' }}>
              <span style={{ width: '10px', height: '2px', backgroundColor: '#f43f5e', borderTop: '1px dashed #f43f5e' }} />
              <span>High ({thresholdHigh})</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ width: '100%', position: 'relative' }}>
        <svg
          viewBox={`0 0 ${viewWidth} ${height}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {series.map(s => (
              <linearGradient key={`grad-${s.key}`} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.33, 0.66, 1].map(fraction => {
            const y = paddingTop + plotHeight * fraction;
            const val = maxVal - fraction * (maxVal - minVal);
            return (
              <g key={fraction}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={viewWidth - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Moderate threshold line */}
          {thresholdMod !== undefined && thresholdMod <= maxVal && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(thresholdMod)}
                x2={viewWidth - paddingRight}
                y2={getY(thresholdMod)}
                stroke="#f59e0b"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.8"
              />
            </g>
          )}

          {/* High threshold line */}
          {thresholdHigh !== undefined && thresholdHigh <= maxVal && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(thresholdHigh)}
                x2={viewWidth - paddingRight}
                y2={getY(thresholdHigh)}
                stroke="#f43f5e"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.8"
              />
            </g>
          )}

          {/* Area fills and lines */}
          {paths.map(p => (
            <g key={p.key}>
              <path d={p.areaPath} fill={`url(#grad-${p.key})`} />
              <path
                d={p.linePath}
                fill="none"
                stroke={p.color}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ))}

          {/* X-axis time ticks */}
          {data.map((d, i) => {
            // Show every ~6th tick or endpoints
            const step = Math.max(1, Math.floor(data.length / 6));
            if (i % step === 0 || i === data.length - 1) {
              const x = getX(i);
              return (
                <text
                  key={i}
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  {formatTime(d.timestamp)}
                </text>
              );
            }
            return null;
          })}

          {/* Interactive Scrub Line */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={paddingTop + plotHeight}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {series.map(s => {
                const val = Number(data[hoverIndex][s.key] ?? 0);
                return (
                  <circle
                    key={s.key}
                    cx={getX(hoverIndex)}
                    cy={getY(val)}
                    r="4.5"
                    fill={s.color}
                    stroke="#0a0f1d"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          )}

          {/* Mouse capture overlays */}
          {data.map((_, i) => {
            const x = getX(i);
            const w = plotWidth / Math.max(1, data.length);
            return (
              <rect
                key={i}
                x={x - w / 2}
                y={paddingTop}
                width={w}
                height={plotHeight}
                fill="transparent"
                style={{ cursor: 'crosshair' }}
                onMouseEnter={() => setHoverIndex(i)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {activePoint && hoverIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: `${Math.min(80, Math.max(15, (hoverIndex / data.length) * 100))}%`,
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(10, 15, 29, 0.94)',
              border: '1px solid rgba(14, 165, 233, 0.4)',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              pointerEvents: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              zIndex: 10,
              minWidth: '150px',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.25rem', marginBottom: '0.35rem' }}>
              {new Date(activePoint.timestamp).toLocaleString()}
            </div>
            {series.map(s => (
              <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.75rem' }}>
                <span style={{ color: '#cbd5e1' }}>{s.label}:</span>
                <span className="mono-num" style={{ fontWeight: 700, color: s.color }}>
                  {Number(activePoint[s.key] ?? 0).toFixed(1)} {s.unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
