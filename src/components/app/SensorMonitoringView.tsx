import React, { useState } from 'react';
import {
  CloudRain,
  Droplet,
  Compass,
  Radio,
  Thermometer,
  Wind,
  AlertTriangle,
  Battery,
  Wifi,
  Search,
  Download,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { StatusPill } from '../common/StatusPill';
import { RiskBadge } from '../common/RiskBadge';
import { MetricCard } from '../common/MetricCard';

const exportTelemetryCsv = (dataList: any[]) => {
  const headers = ['id', 'deviceId', 'timestamp', 'rainfall_mm_h', 'rainfall24h_mm', 'soilMoisture_pct', 'tilt_deg', 'vibration_g', 'temp_c', 'humidity_pct', 'riskLevel', 'source'];
  const rows = dataList.map(r => [
    r.id,
    r.deviceId,
    r.timestamp,
    r.rainfall,
    r.rainfall24h,
    r.soilMoisture,
    r.tilt,
    r.vibration,
    r.temperature,
    r.humidity,
    r.riskLevel,
    r.source,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `terrashield_telemetry_export.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const SensorMonitoringView: React.FC = () => {
  const {
    devices,
    latestReadings,
    readings,
    selectedDeviceId,
    thresholds,
  } = useTelemetry();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterImplausibleOnly, setFilterImplausibleOnly] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const activeDevice =
    selectedDeviceId === 'ALL'
      ? devices[0]
      : devices.find(d => d.deviceId === selectedDeviceId) || devices[0];

  const activeReading =
    latestReadings.find(r => r.deviceId === activeDevice?.deviceId) || latestReadings[0];

  // Filter historical table
  const filteredList = readings.filter(r => {
    const matchesDevice = selectedDeviceId === 'ALL' || r.deviceId === selectedDeviceId;
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.assessmentReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesImplausible = !filterImplausibleOnly || r.isImplausible;
    return matchesDevice && matchesSearch && matchesImplausible;
  });

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = filteredList.slice((page - 1) * pageSize, page * pageSize);

  const exportCsv = () => exportTelemetryCsv(filteredList);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Node Selector Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
              {activeDevice ? activeDevice.name : 'All Monitored Sectors'}
            </h3>
            {activeDevice && <StatusPill type="device-status" value={activeDevice.status} />}
            <StatusPill type="data-source" value={activeReading?.source || 'SIMULATED'} />
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {activeDevice?.locationLabel} &bull; Coordinates: {activeDevice?.latitude.toFixed(4)}°N, {activeDevice?.longitude.toFixed(4)}°E &bull; Elevation: {activeDevice?.elevation}m MSL
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Battery size={16} color="#10b981" />
            <span>Battery: {activeReading?.batteryLevel ?? 94}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Wifi size={16} color="#38bdf8" />
            <span>RSSI: {activeReading?.signalStrength ?? -68} dBm</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Sampling: 60s Interval
          </div>
        </div>
      </div>

      {/* 6 Comprehensive Sensor Telemetry Channels */}
      {activeReading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <MetricCard
            title="Precipitation Intensity"
            subtitle="Tipping Bucket Rain Gauge"
            value={activeReading.rainfall}
            unit="mm/h"
            secondaryValue={`Cumulative 24h: ${activeReading.rainfall24h} mm`}
            icon={<CloudRain size={20} />}
            thresholdMod={thresholds.rainfallRateMod}
            thresholdHigh={thresholds.rainfallRateHigh}
            maxScale={60}
            isImplausible={activeReading.isImplausible}
            implausibleReason={activeReading.implausibleReason}
          />

          <MetricCard
            title="Volumetric Soil Saturation"
            subtitle="FDR Soil Dielectric Probe"
            value={activeReading.soilMoisture}
            unit="% VWC"
            secondaryValue="Pore-Water Saturation Indicator"
            icon={<Droplet size={20} />}
            thresholdMod={thresholds.soilMoistureMod}
            thresholdHigh={thresholds.soilMoistureHigh}
            maxScale={100}
          />

          <MetricCard
            title="Biaxial Inclinometer Deflection"
            subtitle="MEMS Angular Tilt Transducer"
            value={activeReading.tilt}
            unit="°"
            secondaryValue={`Pitch: ${activeReading.tiltPitch ?? (activeReading.tilt * 0.7).toFixed(2)}° | Roll: ${activeReading.tiltRoll ?? (activeReading.tilt * 0.7).toFixed(2)}°`}
            icon={<Compass size={20} />}
            thresholdMod={thresholds.tiltMod}
            thresholdHigh={thresholds.tiltHigh}
            maxScale={6}
          />

          <MetricCard
            title="Peak Ground Acceleration (PPA)"
            subtitle="Triaxial Seismic Accelerometer"
            value={activeReading.vibration}
            unit="g"
            secondaryValue="Dynamic Shear Degradation"
            icon={<Radio size={20} />}
            thresholdMod={thresholds.vibrationMod}
            thresholdHigh={thresholds.vibrationHigh}
            maxScale={1.0}
          />

          <MetricCard
            title="Ambient Slope Temperature"
            subtitle="Integrated Thermal Transducer"
            value={activeReading.temperature}
            unit="°C"
            secondaryValue="Freeze-Thaw Cycle Monitor"
            icon={<Thermometer size={20} />}
            maxScale={50}
          />

          <MetricCard
            title="Relative Air Humidity"
            subtitle="Capacitive RH Hygrometer"
            value={activeReading.humidity}
            unit="% RH"
            secondaryValue="Vapor Pressure Deficit"
            icon={<Wind size={20} />}
            maxScale={100}
          />
        </div>
      )}

      {/* Raw Telemetry Records & Forensic Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              Historical Sensor Telemetry Frames ({filteredList.length} records)
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Time-ordered frames validated for physical plausibility and rate-of-change
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search frame ID or reason..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2rem', fontSize: '0.8rem', width: '220px' }}
              />
              <Search size={14} color="#64748b" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filterImplausibleOnly}
                onChange={e => setFilterImplausibleOnly(e.target.checked)}
              />
              <span>Implausible Only</span>
            </label>

            <button className="btn btn-secondary btn-sm" onClick={exportCsv}>
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Frame ID</th>
                <th>Device ID</th>
                <th>Timestamp</th>
                <th>Rain Rate (mm/h)</th>
                <th>24h Rain (mm)</th>
                <th>Moisture (%)</th>
                <th>Tilt (°)</th>
                <th>PPA (g)</th>
                <th>Risk State</th>
                <th>Plausibility</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map(item => (
                <tr key={item.id}>
                  <td className="mono-num" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {item.id}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#38bdf8' }}>{item.deviceId}</span>
                  </td>
                  <td className="mono-num" style={{ fontSize: '0.75rem' }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="mono-num" style={{ color: item.rainfall >= thresholds.rainfallRateHigh ? '#fb7185' : '#f8fafc' }}>
                    {item.rainfall.toFixed(1)}
                  </td>
                  <td className="mono-num">
                    {item.rainfall24h.toFixed(1)}
                  </td>
                  <td className="mono-num" style={{ color: item.soilMoisture >= thresholds.soilMoistureHigh ? '#fb7185' : '#f8fafc' }}>
                    {item.soilMoisture.toFixed(1)}%
                  </td>
                  <td className="mono-num" style={{ color: item.tilt >= thresholds.tiltHigh ? '#fb7185' : '#f8fafc' }}>
                    {item.tilt.toFixed(2)}°
                  </td>
                  <td className="mono-num">
                    {item.vibration.toFixed(3)}
                  </td>
                  <td>
                    <RiskBadge level={item.riskLevel} size="sm" showPulse={false} />
                  </td>
                  <td>
                    {item.isImplausible ? (
                      <span style={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <AlertTriangle size={12} /> Check Sensor
                      </span>
                    ) : (
                      <span style={{ color: '#34d399', fontSize: '0.7rem' }}>Valid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span>
            Page {page} of {totalPages} ({filteredList.length} total readings)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
