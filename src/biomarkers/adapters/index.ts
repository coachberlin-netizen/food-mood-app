import type { BiomarkerAdapter, Provider } from "../types";
import { OuraAdapter } from "./oura";
import { WhoopAdapter } from "./whoop";
import { FitbitAdapter } from "./fitbit";

const WEB_PROVIDERS: Provider[] = ["oura", "whoop", "fitbit"];
export { WEB_PROVIDERS };

export function getAdapter(provider: Provider): BiomarkerAdapter {
  switch (provider) {
    case "oura":
      return new OuraAdapter(process.env.OURA_CLIENT_ID!, process.env.OURA_CLIENT_SECRET!);
    case "whoop":
      return new WhoopAdapter(process.env.WHOOP_CLIENT_ID!, process.env.WHOOP_CLIENT_SECRET!);
    case "fitbit":
      return new FitbitAdapter(process.env.FITBIT_CLIENT_ID!, process.env.FITBIT_CLIENT_SECRET!);
    case "healthkit":
      throw new Error("healthkit requiere bridge nativo iOS — usa el endpoint /api/biomarkers/healthkit/push");
    case "googlefit":
      throw new Error("googlefit no está implementado — usa Health Connect en la app nativa");
    default: {
      const _never: never = provider;
      throw new Error(`Proveedor no soportado: ${String(_never)}`);
    }
  }
}
