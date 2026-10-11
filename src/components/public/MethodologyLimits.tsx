import React from 'react';
import { AlertTriangle, BookOpen, Scale, FileText, CheckCircle2 } from 'lucide-react';

export const MethodologyLimits: React.FC = () => {
  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
          Geotechnical Methodology &amp; Scientific Limitations
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '740px', margin: '0 auto' }}>
          Transparent documentation of physical mechanics, deterministic threshold models, and instrumentation boundaries.
        </p>
      </div>

      {/* Geotechnical Methodology Overview */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <BookOpen size={22} color="#38bdf8" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
            Geotechnical Physics &amp; Threshold Derivation
          </h3>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Slope stability is governed by the <strong>Mohr-Coulomb shear strength criterion</strong>:
          <br />
          <code style={{ display: 'inline-block', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: '#38bdf8', fontFamily: 'JetBrains Mono', margin: '0.5rem 0' }}>
            &tau; = c' + (&sigma; - u) &middot; tan(&phi;')
          </code>
          <br />
          Where <strong>c'</strong> is effective soil cohesion, <strong>&sigma;</strong> is total normal stress, <strong>&phi;'</strong> is the internal angle of friction, and <strong>u</strong> is pore-water pressure.
        </p>

        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>
          During sustained precipitation, volumetric moisture <strong>(VWC)</strong> elevates <em>u</em>, directly reducing the effective normal stress <code>(&sigma; - u)</code>. Once pore pressure approaches saturation (&gt;80–85% VWC) on slopes steeper than 35°, the Factor of Safety (FS) drops below 1.0, triggering shear slip. The TerraShield deterministic rule engine pairs this with empirical <strong>Intensity-Duration (I-D)</strong> rainfall thresholds (adapted from Caine 1980 &amp; Guzzetti 2008) to classify imminent risk.
        </p>
      </div>

      {/* Explicit Known Limitations */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scale size={20} color="#fbbf24" />
          Critical Operational &amp; Sensor Boundaries
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #f59e0b' }}>
            <h5 style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              1. Spatial Point-Sensor Constraint
            </h5>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              A telemetry node monitors only the immediate geotechnical column in its installed radius (typically 15 to 40 meters depending on soil homogeneity). A slip surface initiating 100 meters away along an unmonitored gully will not be captured until movement physically impacts the node's anchoring collar.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #f59e0b' }}>
            <h5 style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              2. Geological Subsurface Heterogeneity
            </h5>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Bedrock fractures, perched water tables, and buried paleochannels create localized slip surfaces that cannot be fully diagnosed through surface and near-surface sensors alone. Core drilling and geological mapping remain essential prerequisites.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #f59e0b' }}>
            <h5 style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              3. Environmental &amp; Hardware Vulnerability
            </h5>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Severe rockfalls, tree canopy strikes, lightning surges, and prolonged solar occlusion can incapacitate hardware. The platform marks sensors as <code>STALE</code> or <code>OFFLINE</code> when heartbeats lapse, but lost data during extreme typhoons cannot be guaranteed.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '3px solid #f59e0b' }}>
            <h5 style={{ color: '#fbbf24', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              4. Machine Learning Upgrade Readiness
            </h5>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              The system currently operates on fully transparent, deterministic heuristics. A modular interface is provided for an XGBoost gradient-boosted decision tree model; however, this model is deliberately disabled pending empirical geotechnical calibration data to avoid unvalidated AI predictions.
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Legal & Life-Safety Directive */}
      <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <AlertTriangle size={24} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#fb7185', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              MANDATORY LIFE-SAFETY PROTOCOL
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>
              TerraShield AI is designed to assist emergency managers and geotechnical specialists by synthesizing telemetry. <strong>Under no circumstances should automated system alerts replace direct instructions, red alerts, or evacuation directives issued by official government disaster authorities (e.g. NDMA, USGS, Civil Defense, BMKG).</strong> If local authorities order an evacuation, residents must comply immediately, regardless of current dashboard readings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
