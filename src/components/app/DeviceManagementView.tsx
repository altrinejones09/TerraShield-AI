import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  MapPin,
  X,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { StatusPill } from '../common/StatusPill';
import type { CreateDeviceRequest } from '../../types/telemetry';

export const DeviceManagementView: React.FC = () => {
  const { devices, registerDevice } = useTelemetry();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    devices[0]?.deviceId || ''
  );

  // New Device Form state
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newLat, setNewLat] = useState('11.4120');
  const [newLng, setNewLng] = useState('76.6980');
  const [newElevation, setNewElevation] = useState('1820');
  const [newSlopeAngle, setNewSlopeAngle] = useState('44');
  const [newSoilType, setNewSoilType] = useState('Laterite over weathered gneiss');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const activeDevice = devices.find(d => d.deviceId === selectedDeviceId) || devices[0];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newId || !newName || !newLocation) {
      setFormError('Please fill in Device ID, Name, and Location Label.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateDeviceRequest = {
        deviceId: newId.trim().toUpperCase(),
        name: newName.trim(),
        locationLabel: newLocation.trim(),
        latitude: parseFloat(newLat) || 0,
        longitude: parseFloat(newLng) || 0,
        elevation: parseFloat(newElevation) || 0,
        slopeAngle: parseFloat(newSlopeAngle) || 35,
        soilType: newSoilType.trim(),
        configuredSensors: ['rainfall', 'soilMoisture', 'tilt', 'vibration', 'temperature', 'humidity'],
        source: 'SIMULATED', // Explicit: simulated until real hardware provisioned
      };

      await registerDevice(payload);
      setIsRegisterOpen(false);
      setSelectedDeviceId(payload.deviceId);
      // Reset form
      setNewId('');
      setNewName('');
      setNewLocation('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to register station.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header & Register Action */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            Geotechnical Monitoring Stations ({devices.length} Registered Nodes)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Telemetry status, sensor payload health, and physical slope anchoring configurations
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsRegisterOpen(true)}
        >
          <Plus size={16} />
          Register Telemetry Node
        </button>
      </div>

      {/* Grid of Devices */}
      <div className="grid-cards">
        {devices.map(dev => {
          const isSelected = activeDevice?.deviceId === dev.deviceId;

          return (
            <div
              key={dev.deviceId}
              onClick={() => setSelectedDeviceId(dev.deviceId)}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                borderColor: isSelected ? 'rgba(14, 165, 233, 0.45)' : undefined,
                backgroundColor: isSelected ? 'rgba(22, 32, 56, 0.85)' : 'var(--glass-bg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span className="mono-num" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                      {dev.deviceId}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.1rem' }}>
                      {dev.name}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                    <StatusPill type="device-status" value={dev.status} />
                    <StatusPill type="data-source" value={dev.source} size="sm" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  <MapPin size={14} color="#64748b" />
                  <span>{dev.locationLabel}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', marginBottom: '1rem', color: '#cbd5e1' }}>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                    Slope: <strong>{dev.slopeAngle}°</strong>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                    Elevation: <strong>{dev.elevation}m</strong>
                  </div>
                </div>

                {/* Configured Sensors */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {dev.configuredSensors.map(sensor => (
                    <span
                      key={sensor}
                      style={{
                        fontSize: '0.68rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        color: '#94a3b8',
                      }}
                    >
                      {sensor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Health Bar */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Last Seen: {new Date(dev.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: dev.healthScore > 80 ? '#10b981' : '#f59e0b' }}>
                  Health: {dev.healthScore}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node In-Depth Geotechnical Specs */}
      {activeDevice && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <Cpu size={20} color="#38bdf8" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                  {activeDevice.name} ({activeDevice.deviceId}) Detailed Profile
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {activeDevice.locationLabel} &bull; Firmware: {activeDevice.firmwareVersion}
              </p>
            </div>
            <StatusPill type="data-source" value={activeDevice.source} size="md" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>GPS Coordinates</span>
              <span className="mono-num" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                {activeDevice.latitude.toFixed(4)}°N, {activeDevice.longitude.toFixed(4)}°E
              </span>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Soil Profile</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                {activeDevice.soilType}
              </span>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Slope Incline Angle</span>
              <span className="mono-num" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                {activeDevice.slopeAngle}° (Critical Threshold &gt; 38°)
              </span>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Telemetry Heartbeat Rule</span>
              <span style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                Online &le; 15m &bull; Stale &le; 90m &bull; Offline &gt; 90m
              </span>
            </div>
          </div>

          {activeDevice.notes && (
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(14, 165, 233, 0.06)', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.2)', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <strong>Field Engineering Notes:</strong> {activeDevice.notes}
            </div>
          )}
        </div>
      )}

      {/* Register Device Modal */}
      {isRegisterOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 11, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '580px',
              backgroundColor: '#0c1324',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Register New Monitoring Node
              </h3>
              <button onClick={() => setIsRegisterOpen(false)} style={{ color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444', color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Node ID (e.g. NODE-SLOPE-05)
                  </label>
                  <input
                    type="text"
                    value={newId}
                    onChange={e => setNewId(e.target.value)}
                    placeholder="NODE-SLOPE-05"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Station Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Wayanad Ghat Node 5"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Location Label
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  placeholder="Western Ghats, Pass Sector 9B"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Latitude (°N)
                  </label>
                  <input
                    type="text"
                    value={newLat}
                    onChange={e => setNewLat(e.target.value)}
                    placeholder="11.4120"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Longitude (°E)
                  </label>
                  <input
                    type="text"
                    value={newLng}
                    onChange={e => setNewLng(e.target.value)}
                    placeholder="76.6980"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Elevation (m)
                  </label>
                  <input
                    type="number"
                    value={newElevation}
                    onChange={e => setNewElevation(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Slope Angle (°)
                  </label>
                  <input
                    type="number"
                    value={newSlopeAngle}
                    onChange={e => setNewSlopeAngle(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>
                    Soil Profile
                  </label>
                  <input
                    type="text"
                    value={newSoilType}
                    onChange={e => setNewSoilType(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(168, 85, 247, 0.08)', borderRadius: '6px', border: '1px solid rgba(168, 85, 247, 0.25)', color: '#c084fc', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
                <strong>Hardware Integration Notice:</strong> Node will be initialized in SIMULATED demonstration mode. Physical ESP32 connection requires AWS IoT Core certificate provisioning.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsRegisterOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-sm">
                  {isSubmitting ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
