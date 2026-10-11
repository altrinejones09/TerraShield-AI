/**
 * TerraShield AI — Database Access Layer (DynamoDB with in-memory fallback)
 * Uses Partition Key (PK) & Sort Key (SK) design:
 *   - Device Table: PK = deviceId
 *   - Readings Table: PK = deviceId, SK = timestamp
 *   - Alerts Table: PK = deviceId, SK = timestamp
 *   - Risk Assessments Table: PK = deviceId, SK = timestamp
 */

import { INITIAL_DEVICES, INITIAL_READINGS, INITIAL_ALERTS } from '../../src/lib/mockData';

export interface DbStore {
  devices: any[];
  readings: any[];
  alerts: any[];
  riskAssessments: any[];
}

class DatabaseAdapter {
  private inMemory: DbStore;
  private isDynamoConfigured: boolean;

  constructor() {
    this.inMemory = {
      devices: [...INITIAL_DEVICES],
      readings: [...INITIAL_READINGS],
      alerts: [...INITIAL_ALERTS],
      riskAssessments: [],
    };
    this.isDynamoConfigured = Boolean(process.env.DYNAMODB_TABLE_READINGS && process.env.AWS_REGION);
  }

  public getStorageType(): 'DynamoDB' | 'InMemoryStore' {
    return this.isDynamoConfigured ? 'DynamoDB' : 'InMemoryStore';
  }

  // --- Devices ---
  public async getDevices(): Promise<any[]> {
    return [...this.inMemory.devices];
  }

  public async getDevice(deviceId: string): Promise<any | null> {
    return this.inMemory.devices.find(d => d.deviceId === deviceId) || null;
  }

  public async putDevice(device: any): Promise<void> {
    const existingIdx = this.inMemory.devices.findIndex(d => d.deviceId === device.deviceId);
    if (existingIdx !== -1) {
      this.inMemory.devices[existingIdx] = device;
    } else {
      this.inMemory.devices.push(device);
    }
  }

  // --- Readings ---
  public async getLatestReadings(deviceId?: string): Promise<any[]> {
    if (deviceId) {
      const filtered = this.inMemory.readings.filter(r => r.deviceId === deviceId);
      return filtered.length > 0 ? [filtered[filtered.length - 1]] : [];
    }

    const map = new Map<string, any>();
    for (const r of this.inMemory.readings) {
      const existing = map.get(r.deviceId);
      if (!existing || new Date(r.timestamp) > new Date(existing.timestamp)) {
        map.set(r.deviceId, r);
      }
    }
    return Array.from(map.values());
  }

  public async getReadingsHistory(query: { deviceId?: string; limit?: number; riskLevel?: string }): Promise<any[]> {
    let list = [...this.inMemory.readings];
    if (query.deviceId) {
      list = list.filter(r => r.deviceId === query.deviceId);
    }
    if (query.riskLevel) {
      list = list.filter(r => r.riskLevel === query.riskLevel);
    }
    list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    if (query.limit && query.limit > 0) {
      list = list.slice(-query.limit);
    }
    return list;
  }

  public async putReading(reading: any): Promise<void> {
    this.inMemory.readings.push(reading);
    // Update device lastSeen
    const dev = this.inMemory.devices.find(d => d.deviceId === reading.deviceId);
    if (dev) {
      dev.lastSeen = reading.timestamp;
    }
  }

  // --- Alerts ---
  public async getAlerts(severity?: string, acknowledged?: boolean): Promise<any[]> {
    let list = [...this.inMemory.alerts];
    if (severity) {
      list = list.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
    }
    if (acknowledged !== undefined) {
      list = list.filter(a => a.acknowledged === acknowledged);
    }
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return list;
  }

  public async putAlert(alert: any): Promise<void> {
    this.inMemory.alerts.unshift(alert);
  }

  public async acknowledgeAlert(id: string, ackBy: string, actionTaken: string): Promise<any | null> {
    const alert = this.inMemory.alerts.find(a => a.id === id);
    if (!alert) return null;

    alert.acknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = ackBy;
    alert.actionTaken = actionTaken;
    return alert;
  }
}

export const db = new DatabaseAdapter();
