import React from 'react';

interface RadarRiskProps {
  rainfallScore: number;
  soilMoistureScore: number;
  tiltScore: number;
  vibrationScore: number;
  overallScore: number;
  size?: number;
}

export const RadarRiskIndicator: React.FC<RadarRiskProps> = ({
  rainfallScore,
  soilMoistureScore,
  tiltScore,
  vibrationScore,
  overallScore,
  size = 200,
}) => {
  const center = size / 2;
  const radius = size * 0.38;

  // 4 axes: Top (Tilt), Right (Moisture), Bottom (Rainfall), Left (Vibration)
  const axes = [
    { label: 'Ground Tilt', score: tiltScore, angle: -Math.PI / 2 },
    { label: 'Soil Saturation', score: soilMoistureScore, angle: 0 },
    { label: 'Rainfall Load', score: rainfallScore, angle: Math.PI / 2 },
    { label: 'Vibration/PPA', score: vibrationScore, angle: Math.PI },
  ];

  const getCoordinates = (score: number, angle: number) => {
    const r = (Math.min(100, Math.max(0, score)) / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polygonPoints = axes
    .map(a => {
      const { x, y } = getCoordinates(a.score, a.angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const fillColor =
    overallScore >= 75
      ? 'rgba(244, 63, 94, 0.25)'
      : overallScore >= 45
      ? 'rgba(245, 158, 11, 0.22)'
      : 'rgba(16, 185, 129, 0.18)';

  const strokeColor =
    overallScore >= 75 ? '#f43f5e' : overallScore >= 45 ? '#f59e0b' : '#10b981';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Risk factor radar chart, overall score ${overallScore} out of 100`}
      >
        <title>Geotechnical Risk Factor Radar Chart</title>
        <desc>
          {`Composite risk score: ${overallScore}/100. Ground Tilt: ${tiltScore}/100, Soil Moisture: ${soilMoistureScore}/100, Rainfall: ${rainfallScore}/100, Vibration: ${vibrationScore}/100.`}
        </desc>
        {/* Background concentric reference webs (25%, 50%, 75%, 100%) */}
        {[0.25, 0.5, 0.75, 1.0].map(ratio => {
          const webPoints = axes
            .map(a => {
              const x = center + radius * ratio * Math.cos(a.angle);
              const y = center + radius * ratio * Math.sin(a.angle);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');
          return (
            <polygon
              key={ratio}
              points={webPoints}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={ratio === 1 ? '1.5' : '1'}
              strokeDasharray={ratio < 1 ? '2 2' : 'none'}
            />
          );
        })}

        {/* Axis crosshairs */}
        {axes.map((a, i) => {
          const x = center + radius * Math.cos(a.angle);
          const y = center + radius * Math.sin(a.angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* Hazard Polygon Envelope */}
        <polygon
          points={polygonPoints}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Vertex Markers */}
        {axes.map((a, i) => {
          const { x, y } = getCoordinates(a.score, a.angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill={strokeColor}
              stroke="#0a0f1d"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Center score readout */}
        <text
          x={center}
          y={center + 5}
          textAnchor="middle"
          fill="#f8fafc"
          fontSize="14"
          fontWeight="800"
          fontFamily="JetBrains Mono"
        >
          {overallScore}
        </text>
        <text
          x={center}
          y={center + 17}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="8"
          fontWeight="600"
          letterSpacing="0.05em"
        >
          INDEX
        </text>

        {/* Axis Labels */}
        <text x={center} y={12} textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="600">
          Tilt ({tiltScore})
        </text>
        <text x={size - 8} y={center + 3} textAnchor="end" fill="#cbd5e1" fontSize="9" fontWeight="600">
          Moist ({soilMoistureScore})
        </text>
        <text x={center} y={size - 4} textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="600">
          Rain ({rainfallScore})
        </text>
        <text x={8} y={center + 3} textAnchor="start" fill="#cbd5e1" fontSize="9" fontWeight="600">
          Vib ({vibrationScore})
        </text>
      </svg>
      <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
        Geotechnical Factor Matrix
      </span>
    </div>
  );
};
