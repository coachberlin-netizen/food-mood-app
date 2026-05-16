import { createClient } from "@supabase/supabase-js";
import { encryptToken, decryptToken } from "./crypto";
import type { Provider, Sample } from "./types";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export interface ConnectionArgs {
  userId: string;
  provider: Provider;
  access: string;
  refresh?: string;
  expiresIn?: number;
  scopes?: string[];
}

export interface Connection {
  access: string;
  refresh: string | null;
  expiresAt: Date | null;
}

export class BiomarkerStore {
  private readonly db = serviceClient();

  async saveConnection(args: ConnectionArgs): Promise<void> {
    const { error } = await this.db.from("biomarker_connections").upsert(
      {
        user_id: args.userId,
        provider: args.provider,
        access_token: encryptToken(args.access),
        refresh_token: args.refresh ? encryptToken(args.refresh) : null,
        expires_at: args.expiresIn
          ? new Date(Date.now() + args.expiresIn * 1000).toISOString()
          : null,
        scopes: args.scopes ?? [],
      },
      { onConflict: "user_id,provider" },
    );
    if (error) throw new Error(`Error guardando conexión: ${error.message}`);
  }

  async getConnection(userId: string, provider: Provider): Promise<Connection | null> {
    const { data, error } = await this.db
      .from("biomarker_connections")
      .select("access_token, refresh_token, expires_at")
      .eq("user_id", userId)
      .eq("provider", provider)
      .maybeSingle();
    if (error) throw new Error(`Error recuperando conexión: ${error.message}`);
    if (!data) return null;
    return {
      access: decryptToken(data.access_token),
      refresh: data.refresh_token ? decryptToken(data.refresh_token) : null,
      expiresAt: data.expires_at ? new Date(data.expires_at) : null,
    };
  }

  async insertSamples(samples: Sample[]): Promise<void> {
    if (samples.length === 0) return;
    const { error } = await this.db.from("biomarker_samples").insert(
      samples.map((s) => ({
        user_id: s.userId,
        provider: s.provider,
        type: s.type,
        value: s.value,
        unit: s.unit,
        measured_at: s.measuredAt.toISOString(),
      })),
    );
    if (error) throw new Error(`Error insertando muestras: ${error.message}`);
  }

  async recent(userId: string, days = 7): Promise<Sample[]> {
    const since = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString();
    const { data, error } = await this.db
      .from("biomarker_samples")
      .select("user_id, provider, type, value, unit, measured_at")
      .eq("user_id", userId)
      .gte("measured_at", since)
      .order("measured_at", { ascending: false });
    if (error) throw new Error(`Error recuperando muestras: ${error.message}`);
    return (data ?? []).map((row) => ({
      userId: row.user_id,
      provider: row.provider as Provider,
      type: row.type as Sample["type"],
      value: Number(row.value),
      unit: row.unit,
      measuredAt: new Date(row.measured_at),
    }));
  }
}
