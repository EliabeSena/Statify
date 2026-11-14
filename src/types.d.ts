interface BatteryInfo {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface Navigator {
  getBattery?: () => Promise<BatteryManager>;
  deviceMemory?: number | undefined;
}

interface MediaTrackSettings {
  voiceIsolation?: boolean;
  latency?: number;
  focusMode?: string;
  facingMode?: string;
  exposureMode?: string;
  whiteBalanceMode?: string;
  zoom?: number;
  torch?: boolean;
}