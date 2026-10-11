import React from 'react';
import { Activity, ArrowRight, Play, CloudRain, Droplet, Compass, Radio } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

interface LandingHeroProps {
  onExplore: () => void;
  onSignUp: () => void;
  onOpenSimulator: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExplore,
  onSignUp,
  onOpenSimulator,
}) => {
  return (
    <section style={{ padding: '4.5rem 2rem 3rem', maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>
      {/* Background ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '650px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(20, 184, 166, 0.05) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
        {/* Top Tagline Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            color: '#38bdf8',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9', boxShadow: '0 0 10px #0ea5e9' }} />
          DETECT EARLY. ALERT EARLY. PROTECT LIVES.
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5.2vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#f8fafc',
            marginBottom: '1.25rem',
          }}
        >
          TerraShield AI — Landslide Early Warning &amp; Life-Safety System
        </h1>

        {/* Subhead */}
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
            color: '#94a3b8',
            lineHeight: 1.6,
            marginBottom: '2.25rem',
            maxWidth: '740px',
            margin: '0 auto 2.25rem',
          }}
        >
          Next-generation geotechnical risk monitoring. Synchronizing multi-sensor hydrological telemetry (peak rainfall and soil moisture saturation) with kinematic inclinometer slope displacement to deliver deterministic life-safety hazard alerts before catastrophic failure.
        </p>

        {/* Primary Call to Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3.5rem',
          }}
        >
          <button
            className="btn btn-primary btn-lg"
            onClick={onExplore}
            style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}
          >
            <Activity size={18} />
            Explore Live Dashboard
            <ArrowRight size={16} />
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={onSignUp}
            style={{ fontSize: '1rem', padding: '0.85rem 1.5rem' }}
          >
            Create Analyst Account
          </button>

          <button
            className="btn btn-outline btn-lg"
            onClick={onOpenSimulator}
            style={{
              borderColor: 'rgba(168, 85, 247, 0.45)',
              color: '#c084fc',
              background: 'rgba(168, 85, 247, 0.08)',
            }}
          >
            <Play size={16} />
            Simulate Hazard Event
          </button>
        </div>

        {/* Live Telemetry Snapshot Card (Interactive Preview) */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            textAlign: 'left',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                Active Telemetry Node: Western Ghats Sector 4A
              </span>
              <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                SIMULATED FEED
              </span>
            </div>
            <RiskBadge level="HIGH" size="sm" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                <CloudRain size={14} /> Peak Rain Rate
              </div>
              <div className="mono-num" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb7185' }}>
                48.2 <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>mm/h</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#fb7185' }}>Breached High Threshold (&ge;45)</span>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2dd4bf', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                <Droplet size={14} /> Soil Moisture VWC
              </div>
              <div className="mono-num" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb7185' }}>
                87.5 <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>%</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#fb7185' }}>Pore Saturation (&ge;85%)</span>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                <Compass size={14} /> Inclinometer Tilt
              </div>
              <div className="mono-num" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb7185' }}>
                3.82 <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>°</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#fb7185' }}>Active Creep Shear (&ge;3.5°)</span>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a78bfa', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                <Radio size={14} /> Vibration PPA
              </div>
              <div className="mono-num" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                0.18 <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>g</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#10b981' }}>Within Baseline (&lt;0.25g)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
