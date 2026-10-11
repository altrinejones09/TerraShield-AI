import React from 'react';
import { Layers, Server, Database, Cloud, ShieldCheck } from 'lucide-react';

export const SystemArchitecture: React.FC = () => {
  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
          Production AWS Cloud Architecture
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
          Serverless, resilient, least-privilege architecture built on Amazon Web Services for sub-second environmental analysis.
        </p>
      </div>

      {/* Architecture Flow Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Tier 1: Edge & Telemetry */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#38bdf8' }}>
            <Server size={18} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>1. Edge Sensor Array</h4>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            Field ESP32 nodes sampling rain bucket pulses, capacitive soil dielectric constants, and 3-axis inclinometers.
          </p>
          <div style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '0.5rem', borderRadius: '6px', color: '#cbd5e1' }}>
            <strong>Protocol:</strong> MQTT (AWS IoT Core) or REST HTTPS
          </div>
        </div>

        {/* Tier 2: Ingestion & API Gateway */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #2dd4bf' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#2dd4bf' }}>
            <Cloud size={18} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>2. API Gateway &amp; IoT Core</h4>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            Amazon API Gateway (HTTP API) handles dashboard requests with CORS, throttling, and Cognito JWT authorizer verification.
          </p>
          <div style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '0.5rem', borderRadius: '6px', color: '#cbd5e1' }}>
            <strong>Auth:</strong> Amazon Cognito User Pool JWTs
          </div>
        </div>

        {/* Tier 3: Compute & Risk Engine */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #fbbf24' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#fbbf24' }}>
            <Layers size={18} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>3. AWS Lambda Handlers</h4>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            Stateless TypeScript functions validate telemetry bounds, compute deterministic risk scores, and deduplicate alerts.
          </p>
          <div style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '0.5rem', borderRadius: '6px', color: '#cbd5e1' }}>
            <strong>Engine:</strong> Geotechnical Rule Engine + ML Slot
          </div>
        </div>

        {/* Tier 4: Storage */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#fb7185' }}>
            <Database size={18} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>4. Amazon DynamoDB</h4>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
            High-throughput NoSQL database. Partition Key: <code>deviceId</code>, Sort Key: <code>timestamp</code>. Bounded queries, zero unbounded scans.
          </p>
          <div style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '0.5rem', borderRadius: '6px', color: '#cbd5e1' }}>
            <strong>Tables:</strong> Readings, Devices, Risk, Alerts
          </div>
        </div>
      </div>

      {/* Security Principles Table */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <ShieldCheck size={22} color="#10b981" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            Security &amp; Reliability Safeguards
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h5 style={{ color: '#38bdf8', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.35rem' }}>Zero Hardcoded Secrets</h5>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              AWS access keys, secret keys, and private credentials are NEVER placed in frontend code or Git commits. IAM roles provide temporary tokens.
            </p>
          </div>

          <div>
            <h5 style={{ color: '#38bdf8', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.35rem' }}>Backend-Enforced Authorization</h5>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Protected routes verify Cognito signature tokens inside Lambda handlers, preventing unauthorized reading injection or alert tampering.
            </p>
          </div>

          <div>
            <h5 style={{ color: '#38bdf8', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.35rem' }}>Controlled Degradation &amp; Demo Mode</h5>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              When external AWS credentials are unavailable, the platform operates in a clearly labeled local demonstration mode without crashing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
