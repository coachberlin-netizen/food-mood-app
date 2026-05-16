import type { BiomarkerAdapter, Provider, Sample } from "../types";

const AUTH = "https://www.fitbit.com/oauth2/authorize";
const TOKEN = "https://api.fitbit.com/oauth2/token";
const API = "https://api.fitbit.com";

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export class FitbitAdapter implements BiomarkerAdapter {
  readonly provider: Provider = "fitbit";

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  private basicAuth(): string {
    return "Basic " + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
  }

  authorizeUrl(state: string, redirectUri: string): string {
    const p = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: "sleep heartrate",
      state,
    });
    return `${AUTH}?${p}`;
  }

  async exchangeCode(code: string, redirectUri: string) {
    const res = await fetch(TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: this.basicAuth(),
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
    });
    if (!res.ok) throw new Error(`Fitbit token exchange falló: ${res.status}`);
    const j = await res.json();
    return { access: j.access_token, refresh: j.refresh_token, expiresIn: j.expires_in };
  }

  async refresh(refreshToken: string) {
    const res = await fetch(TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: this.basicAuth(),
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    });
    if (!res.ok) throw new Error(`Fitbit refresh falló: ${res.status}`);
    const j = await res.json();
    return { access: j.access_token, refresh: j.refresh_token, expiresIn: j.expires_in };
  }

  async fetchSamples(accessToken: string, since: Date): Promise<Sample[]> {
    const afterDate = toDateStr(since);
    const today = toDateStr(new Date());
    const headers = { Authorization: `Bearer ${accessToken}` };
    const samples: Sample[] = [];

    const sleepRes = await fetch(
      `${API}/1.2/user/-/sleep/list.json?afterDate=${afterDate}&offset=0&limit=10&sort=asc`,
      { headers },
    );
    if (!sleepRes.ok) throw new Error(`Fitbit sleep falló: ${sleepRes.status}`);
    const sleepJson = await sleepRes.json();

    for (const record of (sleepJson.sleep ?? []) as Record<string, unknown>[]) {
      if (typeof record.minutesAsleep === "number")
        samples.push({
          userId: "", provider: "fitbit", type: "sleep_h",
          value: record.minutesAsleep / 60, unit: "h",
          measuredAt: new Date(record.startTime as string),
        });
    }

    const heartRes = await fetch(
      `${API}/1/user/-/activities/heart/date/${today}/7d.json`,
      { headers },
    );
    if (!heartRes.ok) throw new Error(`Fitbit heart falló: ${heartRes.status}`);
    const heartJson = await heartRes.json();

    for (const record of (heartJson["activities-heart"] ?? []) as Record<string, unknown>[]) {
      const value = (record.value as Record<string, unknown> | undefined)?.restingHeartRate;
      if (typeof value === "number")
        samples.push({
          userId: "", provider: "fitbit", type: "resting_hr",
          value, unit: "bpm",
          measuredAt: new Date(record.dateTime as string),
        });
    }

    return samples;
  }
}
