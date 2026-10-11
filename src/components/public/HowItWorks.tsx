import React from 'react';
import { Cpu, Wifi, ShieldAlert, BellRing } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Resilient Edge Node Deployment',
      icon: Cpu,
      color: '#38bdf8',
      desc: 'Field units feature industrial ESP32-S3 microcontrollers powered by high-efficiency solar harvesting. Nodes interface with dual-axis MEMS inclinometers, frequency-domain soil moisture sensors, and optical/tipping rain gauges anchored directly to bedrock slope collar pins.',
    },
    {
      step: '02',
      title: 'Encrypted Telemetry Ingestion',
      icon: Wifi,
      color: '#2dd4bf',
      desc: 'Sensor readings are digitized, timestamped, and transmitted over cellular LTE-M or LoRaWAN gateways via MQTT directly into AWS IoT Core. Strict token authorization and payload validation guarantee sensor data authenticity.',
    },
    {
      step: '03',
      title: 'Deterministic Rule Risk Engine',
      icon: ShieldAlert,
      color: '#fbbf24',
      desc: 'Backend AWS Lambda handlers ingest the stream, validate measurement plausibility, and evaluate multi-factor geotechnical criteria: pore saturation, rainfall intensity, and angular deflection. A modular slot allows future trained XGBoost ML models.',
    },
    {
      step: '04',
      title: 'Life-Safety Alert Broadcast',
      icon: BellRing,
      color: '#f43f5e',
      desc: 'When threshold breaches or multi-factor hazards are detected, real-time alerts are stored with full forensic audit trails in Amazon DynamoDB and broadcasted instantly to operators, field engineers, and integrated civil defense notification channels.',
    },
  ];

  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
          End-to-End System Operation
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
          From milliradian slope displacement at the mountainside to millisecond cloud hazard evaluation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
        {steps.map(s => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="glass-panel"
              style={{
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="mono-num" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.15)' }}>
                  {s.step}
                </span>
                <div
                  style={{
                    padding: '0.65rem',
                    borderRadius: '10px',
                    backgroundColor: `${s.color}18`,
                    color: s.color,
                  }}
                >
                  <Icon size={22} />
                </div>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                {s.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
