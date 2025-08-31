// src/server/config.ts
import { z } from "zod";

const EnvSchema = z.object({
  ELEVENLABS_API_KEY: z.string().min(10, "ELEVENLABS_API_KEY is missing"),
  ELEVENLABS_VOICE_ID: z.string().min(5, "ELEVENLABS_VOICE_ID is missing"),
  ELEVENLABS_MODEL_ID: z.string().default("eleven_multilingual_v2"),
  NODE_ENV: z.string().optional(),
});

const raw = {
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY?.trim(),
  ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID?.trim(),
  ELEVENLABS_MODEL_ID: process.env.ELEVENLABS_MODEL_ID?.trim(),
  NODE_ENV: process.env.NODE_ENV,
};

export const env = EnvSchema.parse(raw);

// Безпечне ехо в логи (щоб переконатися, що Render їх «бачить»)
export function logEnvSummary() {
  const key = env.ELEVENLABS_API_KEY;
  const safe = key ? `${key.slice(0, 4)}…(${key.length})` : "none";
  console.log("[ENV] ELEVENLABS_API_KEY =", safe);
  console.log("[ENV] ELEVENLABS_VOICE_ID =", env.ELEVENLABS_VOICE_ID);
  console.log("[ENV] ELEVENLABS_MODEL_ID =", env.ELEVENLABS_MODEL_ID);
}
