import { ElevenLabsClient } from "elevenlabs";
import { NextRequest } from "next/server";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_KEY,
});

export async function POST(req: NextRequest) {
  const { text, model, voice } = await req.json();

  const audio = await elevenlabs.generate({
    text: text,
    voice: voice || "6hfb8itl0CXl6ZA7WVIA", // "Charlotte",
    model_id: model || "eleven_multilingual_v2",
  });
  return new Response(audio as any, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
