import type { BiomarkerStore } from "./store";
import type { BiomarkerAdapter } from "./types";

const REFRESH_BUFFER_MS = 60_000;
const SYNC_DAYS = 7;

export async function syncUser(
  userId: string,
  adapter: BiomarkerAdapter,
  store: BiomarkerStore,
): Promise<{ synced: number }> {
  const conn = await store.getConnection(userId, adapter.provider);
  if (!conn) return { synced: 0 };

  let access = conn.access;

  if (conn.refresh && conn.expiresAt && conn.expiresAt.getTime() < Date.now() + REFRESH_BUFFER_MS) {
    const renewed = await adapter.refresh(conn.refresh);
    access = renewed.access;
    await store.saveConnection({
      userId,
      provider: adapter.provider,
      access: renewed.access,
      refresh: renewed.refresh ?? conn.refresh,
      expiresIn: renewed.expiresIn,
    });
  }

  const since = new Date(Date.now() - SYNC_DAYS * 24 * 3600 * 1000);
  const samples = (await adapter.fetchSamples(access, since)).map((s) => ({ ...s, userId }));
  await store.insertSamples(samples);
  return { synced: samples.length };
}
