import type { BiomarkerAdapter, Provider, Sample } from "../types";

const AUTH = "https://cloud.ouraring.com/oauth/authorize";
const TOKEN = "https://api.ouraring.com/oauth/token";
const API = "https://api.ouraring.com/v2/usercollection";

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export class OuraAdapter implements BiomarkerAdapter {
  readonly provider: Provider = "oura";

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  authorizeUrl(state: string, redirectUri: string): string {
    const p = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: "daily heartrate",
      state,
    });
    return `${AUTH}?${p}`;
  }

  async exchangeCode(code: string, redirectUri: string) {
    const res = await fetch(TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });
    if (!res.ok) throw new Error(`Oura token exchange falló: ${res.status}`);
    const j = await res.json();
    return { access: j.access_token, refresh: j.refresh_token, expiresIn: j.expires_in };
  }

  async refresh(refreshToken: string) {
    const res = await fetch(TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });
    if (!res.ok) throw new Error(`Oura refresh falló: ${res.status}`);
    const j = await res.json();
    return { access: j.access_token, refresh: j.refresh_token, expiresIn: j.expires_in };
  }

  async fetchSamples(accessToken: string, since: Date): Promise<Sample[]> {
    const params = new URLSearchParams({
      start_date: toDateStr(since),
      end_date: toDateStr(new Date()),
    });
    const res = await fetch(`${API}/sleep?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Oura fetchSamples falló: ${res.status}`);
    const json = await res.json();
    const samples: Sample[] = [];

    for (const day of (json.data ?? []) as Record<string, unknown>[]) {
      const measuredAt = new Date((day.bedtime_end ?? day.day) as string);

      if (typeof day.average_hrv === "number")
        samples.push({ userId: "", provider: "oura", type: "hrv", value: day.average_hrv, unit: "ms", measuredAt });

      if (typeof day.total_sleep_duration === "number")
        samples.push({ userId: "", provider: "oura", type: "sleep_h", value: day.total_sleep_duration / 3600, unit: "h", measuredAt });

      if (typeof day.average_heart_rate === "number")
        samples.push({ userId: "", provider: "oura", type: "resting_hr", value: day.average_heart_rate, unit: "bpm", measuredAt });
    }
    return samples;
  }
}
