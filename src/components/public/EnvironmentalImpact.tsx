import React from 'react';
import { Mountain, Trees, HeartHandshake, Waves } from 'lucide-react';

export const EnvironmentalImpact: React.FC = () => {
  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
          Environmental &amp; Life-Safety Impact
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
          Protecting vulnerable mountain communities, transportation corridors, and watershed ecosystems through proactive geotechnical intelligence.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <Mountain size={28} color="#38bdf8" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Life-Safety in Mountain Corridors
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Over 4.8 million people reside along high-risk escarpments globally. Providing even 20 to 45 minutes of advance geotechnical warning enables traffic stoppage on hazardous mountain passes and safe community evacuation before debris flows block egress.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <Waves size={28} color="#2dd4bf" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Catchment Basin &amp; River Damming Mitigation
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Major landslides frequently dam mountain rivers, resulting in catastrophic Outburst Floods (GLOFs/LDOFs) downstream. Continuous telemetry flags slope failures before dam blockages trigger catastrophic secondary surges.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <Trees size={28} color="#10b981" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Eco-Restoration &amp; Slope Bioengineering
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Telemetry provides baseline data to evaluate the effectiveness of root-reinforcement bioengineering (such as vetiver grass and deep-root alder plantings) in stabilizing vulnerable cuttings over multi-year monsoon cycles.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <HeartHandshake size={28} color="#a78bfa" style={{ marginBottom: '1rem' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            UN Sendai Framework Alignment
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Directly advances Priority 4 of the UN Sendai Framework for Disaster Risk Reduction by enhancing disaster preparedness for effective response and "Building Back Better" through resilient edge monitoring.
          </p>
        </div>
      </div>
    </section>
  );
};
