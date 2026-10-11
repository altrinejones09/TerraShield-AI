import React from 'react';
import { AlertTriangle, Shield, Terminal, Cloud } from 'lucide-react';

interface FooterProps {
  minimal?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ minimal = false }) => {
  return (
    <footer
      style={{
        backgroundColor: '#070b14',
        borderTop: '1px solid var(--border-subtle)',
        padding: minimal ? '1.25rem 2rem' : '2.5rem 2rem 1.75rem',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Prominent Official Life-Safety Disclaimer */}
        <div
          className="disclaimer-banner"
          style={{
            marginBottom: minimal ? '1rem' : '2rem',
          }}
        >
          <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.2rem' }}>
              LIFE-SAFETY &amp; DISASTER MANAGEMENT DIRECTIVE
            </strong>
            TerraShield AI is an environmental early warning and research analytics system. All demonstration telemetry and simulated thresholds are provided strictly for technical evaluation. In extreme weather or geological instability events, always adhere directly to evacuation orders and warnings issued by official disaster management authorities (NDMA, USGS, Civil Defense, or local emergency services). No single sensor or algorithm can guarantee prediction of all slope failures.
          </div>
        </div>

        {!minimal && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem',
              paddingBottom: '2rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Shield size={18} color="#0ea5e9" />
                <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                  TerraShield AI
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
                High-precision multi-sensor geotechnical telemetry platform combining hydrological load metrics with kinematic inclinometer slope displacement tracking.
              </p>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.75rem' }}>
                Geotechnical Array
              </h5>
              <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>• Tipping-Bucket Rain Gauge (Peak &amp; 24h)</li>
                <li>• FDR Volumetric Soil Moisture (% VWC)</li>
                <li>• MEMS Biaxial Inclinometer (° Tilt Deflection)</li>
                <li>• Triaxial Accelerometer (Peak Ground Vibration)</li>
              </ul>
            </div>

            <div>
              <h5 style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 700, marginBottom: '0.75rem' }}>
                Cloud Architecture
              </h5>
              <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>• AWS SAM Infrastructure as Code</li>
                <li>• AWS Lambda Serverless Functions</li>
                <li>• Amazon DynamoDB Bounded Telemetry Tables</li>
                <li>• Amazon Cognito User Pool Authentication</li>
                <li>• AWS IoT Core ESP32 MQTT Ingestion Hook</li>
              </ul>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
          <div>
            © {new Date().getFullYear()} TerraShield AI Platform. Built with React, TypeScript &amp; AWS Serverless.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Environment: <strong>SIMULATED DEMONSTRATION</strong></span>
            <span>Sensor Mode: <strong>MULTI-FACTOR RULE ENGINE</strong></span>
            <span>Security: <strong>LEAST-PRIVILEGE IAM READY</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
