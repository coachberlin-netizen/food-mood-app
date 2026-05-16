export type Provider = "oura" | "whoop" | "fitbit" | "healthkit" | "googlefit";
export type SampleType =
  | "hrv"
  | "sleep_h"
  | "glucose_mean"
  | "resting_hr"
  | "respiratory_rate";

export type Sample = {
  userId: string;
  provider: Provider;
  type: SampleType;
  value: number;
  unit: string;
  measuredAt: Date;
};

export interface BiomarkerAdapter {
  readonly provider: Provider;
  authorizeUrl(state: string, redirectUri: string): string;
  exchangeCode(
    code: string,
    redirectUri: string
  ): Promise<{ access: string; refresh?: string; expiresIn?: number }>;
  refresh(
    refreshToken: string
  ): Promise<{ access: string; refresh?: string; expiresIn?: number }>;
  fetchSamples(accessToken: string, since: Date): Promise<Sample[]>;
}
