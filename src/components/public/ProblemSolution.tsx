import React from 'react';
import { CloudRain, Droplet, Compass, Activity, Check, X } from 'lucide-react';

export const ProblemSolution: React.FC = () => {
  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
          Why Conventional Warning Systems Fail
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
          Landslides are complex geotechnical failures driven by hydrological pore-pressure and shear-strength dynamics. No single sensor alone can reliably predict slope collapse.
        </p>
      </div>

      {/* The 3 Pitfalls of Single-Sensor Monitoring */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem', borderTop: '3px solid #f43f5e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fb7185' }}>
            <X size={20} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Rainfall Alone Is Deceptive</h4>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
            A torrential 60 mm/h downpour over dry fractured granite may drain safely with zero slope movement. Conversely, a gentle 15 mm/h drizzle over hillsides already saturated by days of antecedent rain will spike pore-water pressure and trigger catastrophic debris flow.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem', borderTop: '3px solid #f43f5e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fb7185' }}>
            <X size={20} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Moisture Alone Lacks Kinematics</h4>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Soil moisture sensors reflect volumetric water content, but soil saturation alone does not guarantee a slide without steep slope gradients, overburden load, or active shear plane failure. Relying solely on moisture yields rampant false alarms.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.75rem', borderTop: '3px solid #f43f5e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b' }}>
            <X size={20} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Inclinometers Can Be Lagging</h4>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Physical inclinometer tilt and displacement sensors only register movement after failure planes have begun creeping. If alerted only after angular displacement exceeds 5 degrees, evacuation windows may have shrunk to mere seconds.
          </p>
        </div>
      </div>

      {/* The TerraShield Solution */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          backgroundColor: '#0c1427',
          border: '1px solid rgba(14, 165, 233, 0.3)',
          borderRadius: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' }}>
            <Check size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              The TerraShield Multi-Factor Geotechnical Approach
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#2dd4bf' }}>
              Correlating Hydrological Load with Sub-Surface Pore Pressure &amp; Surface Kinematics
            </span>
          </div>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          TerraShield AI integrates continuous telemetry across the full physical lifecycle of slope failure. By combining real-time rainfall rate (mm/h) and antecedent 24h precipitation with FDR soil moisture saturation (% VWC), MEMS biaxial inclinometers, and seismic vibration monitoring, the platform computes deterministic hazard levels and verifies each contributing factor before issuing life-safety alerts.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <CloudRain size={20} color="#38bdf8" style={{ marginBottom: '0.5rem' }} />
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>1. Hydrological Trigger</h5>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Measures instantaneous rainfall intensity and cumulative antecedent moisture load.</p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Droplet size={20} color="#2dd4bf" style={{ marginBottom: '0.5rem' }} />
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>2. Pore-Pressure Saturation</h5>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tracks volumetric water content (VWC) reaching critical liquefaction thresholds.</p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Compass size={20} color="#fbbf24" style={{ marginBottom: '0.5rem' }} />
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>3. Sub-Degree Kinematic Tilt</h5>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Detects microscopic slope creep (0.5° to 3.0°) well before gross slope rupture.</p>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Activity size={20} color="#a78bfa" style={{ marginBottom: '0.5rem' }} />
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>4. Dynamic Vibration Shock</h5>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Monitors seismic PPA and micro-tremors that dynamically reduce shear strength.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
