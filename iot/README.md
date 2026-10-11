# TerraShield AI — IoT Core & ESP32 Hardware Integration Guide

This directory contains the edge telemetry firmware and provisioning blueprints for physical **TerraShield AI Geotechnical Stations**.

> **IMPORTANT NOTICE:**  
> Hardware integration is **disabled by default in demonstration mode**. Do not attempt to establish live MQTT connections until physical X.509 certificates and AWS IoT Core endpoints have been registered in your AWS account. Never commit private keys or device certificates to Git.

---

## 1. Hardware Bill of Materials (BOM)

| Sensor / Module | Purpose | Interface | Sampling Specification |
| :--- | :--- | :--- | :--- |
| **ESP32-S3-WROOM-1** | Core Controller & Dual Core MCU | 240 MHz | FreeRTOS, deep sleep power management |
| **Tipping Bucket Rain Gauge** | Precipitation intensity & 24h load | GPIO 14 (Interrupt) | 0.2 mm per pulse, 0 to 300 mm/h |
| **FDR Soil Moisture Probe** | Volumetric Water Content (% VWC) | ADC1 / GPIO 34 | 0 to 100% VWC, frequency-domain |
| **LSM6DSOX / MPU6050** | Biaxial slope inclinometer & vibration | I2C (SDA 21, SCL 22) | &plusmn;0.01&deg; angular resolution, &plusmn;4g PPA |
| **SHT31-D** | Ambient temperature and humidity | I2C (0x44) | -40&deg;C to 80&deg;C, 0 to 100% RH |
| **Solar Harvesting + LiFePO4** | Off-grid continuous power | MPPT 12V / 5Ah | 14-day autonomy under cloudy sky |

---

## 2. Telemetry MQTT Topic Architecture

Edge devices publish telemetry payloads to the following MQTT topic:

```
terrashield/nodes/{deviceId}/telemetry
```

### JSON Telemetry Payload Schema

```json
{
  "deviceId": "NODE-SLOPE-01",
  "timestamp": "2026-10-11T12:00:00Z",
  "rainfall": 34.2,
  "rainfall24h": 92.5,
  "soilMoisture": 78.4,
  "tilt": 1.85,
  "tiltPitch": 1.35,
  "tiltRoll": 1.25,
  "vibration": 0.21,
  "temperature": 19.8,
  "humidity": 82.0,
  "batteryLevel": 94,
  "signalStrength": -68,
  "source": "HARDWARE"
}
```

---

## 3. AWS IoT Core Setup Instructions

### Step 1: Create an IoT Thing
1. Navigate to the **AWS IoT Core Console** &rarr; **All devices** &rarr; **Things**.
2. Click **Create things** &rarr; **Create single thing**.
3. Name: `NODE-SLOPE-01`.

### Step 2: Generate Device Certificates
1. Select **Auto-generate a new certificate (recommended)**.
2. Download:
   - Device certificate (`NODE-SLOPE-01.cert.pem`)
   - Private key (`NODE-SLOPE-01.private.key`)
   - Amazon Root CA 1 (`AmazonRootCA1.pem`)

### Step 3: Attach an IAM Least-Privilege IoT Policy
Create policy `TerraShieldNodePolicy`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:Connect",
      "Resource": "arn:aws:iot:us-east-1:*:client/NODE-SLOPE-*"
    },
    {
      "Effect": "Allow",
      "Action": "iot:Publish",
      "Resource": "arn:aws:iot:us-east-1:*:topic/terrashield/nodes/*/telemetry"
    }
  ]
}
```

### Step 4: AWS IoT Rule for Lambda Ingestion
Create an IoT SQL Rule:
```sql
SELECT * FROM 'terrashield/nodes/+/telemetry'
```
Set action to invoke `TerraShieldIngestionFunction` Lambda.
