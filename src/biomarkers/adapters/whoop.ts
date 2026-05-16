import type { BiomarkerAdapter, Provider, Sample } from "../types";

const AUTH = "https://api.prod.whoop.com/oauth/oauth2/auth";
const TOKEN = "https://api.prod.whoop.com/oauth/oauth2/token";
const API = "https://api.prod.whoop.com/developer/v1";

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export class WhoopAdapter implements BiomarkerAdapter {
  readonly provider: Provider = "whoop";

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  authorizeUrl(state: string, redirectUri: string): string {
    const p = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: "read:recovery read:sleep read:biometric",
      state,
    });
    return `${AUTH}?${p}`;
  }

  private async tokenRequest(body: URLSearchParams) {
    const res = await fetch(TOKEN, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) throw new Error(`Whoop token request falló: ${res.status}`);
    const j = await res.json();
    return { access: j.access_token, refresh: j.refresh_token, expiresIn: j.expires_in };
  }

  async exchangeCode(code: string, redirectUri: string) {
    return this.tokenRequest(new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    }));
  }

  async refresh(refreshToken: string) {
    return this.tokenRequest(new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    }));
  }

  async fetchSamples(accessToken: string, since: Date): Promise<Sample[]> {
    const start = toDateStr(since);
    const end = toDateStr(new Date());
    const headers = { Authorization: `Bearer ${accessToken}` };
    const samples: Sample[] = [];

    const recoveryRes = await fetch(`${API}/recovery?start=${start}&end=${end}`, { headers });
    if (!recoveryRes.ok) throw new Error(`Whoop recovery falló: ${recoveryRes.status}`);
    const recovery = await recoveryRes.json();

    for (const record of (recovery.records ?? []) as Record<string, unknown>[]) {
      const measuredAt = new Date(record.created_at as string);
      const score = record.score as Record<string, unknown> | undefined;
      if (score && typeof score.hrv_rmssd_milli === "number")
        samples.push({ userId: "", provider: "whoop", type: "hrv", value: score.hrv_rmssd_milli, unit: "ms", measuredAt });
      if (score && typeof score.resting_heart_rate === "number")
        samples.push({ userId: "", provider: "whoop", type: "resting_hr", value: score.resting_heart_rate, unit: "bpm", measuredAt });
    }

    const sleepRes = await fetch(`${API}/activity/sleep?start=${start}&end=${end}`, { headers });
    if (!sleepRes.ok) throw new Error(`Whoop sleep falló: ${sleepRes.status}`);
    const sleep = await sleepRes.json();

    for (const record of (sleep.records ?? []) as Record<string, unknown>[]) {
      const measuredAt = new Date(record.created_at as string);
      const score = record.score as Record<string, unknown> | undefined;
      if (score && typeof score.total_in_bed_time_milli === "number")
        samples.push({ userId: "", provider: "whoop", type: "sleep_h", value: score.total_in_bed_time_milli / 3_600_000, unit: "h", measuredAt });
    }

    return samples;
  }
}
