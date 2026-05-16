import type { BiomarkerAdapter } from "./types";
import type { BiomarkerStore } from "./store";

export async function handleOAuthCallback(args: {
  adapter: BiomarkerAdapter;
  store: BiomarkerStore;
  code: string;
  userId: string;
  redirectUri: string;
}): Promise<void> {
  const { adapter, store, code, userId, redirectUri } = args;
  const tokens = await adapter.exchangeCode(code, redirectUri);
  await store.saveConnection({
    userId,
    provider: adapter.provider,
    access: tokens.access,
    refresh: tokens.refresh,
    expiresIn: tokens.expiresIn,
  });
}
