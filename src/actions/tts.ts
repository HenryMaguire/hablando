"use server";

import { NextRequest, NextResponse } from "next/server";
import OpenAI, { ClientOptions } from "openai";

const options: ClientOptions = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(options);

export async function submitTextToSpeech(
  text: string,
  model?: string,
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
) {
  try {
    const response = await openai.audio.speech.create({
      model: model || "tts-1",
      voice: voice || "alloy",
      input: text,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return new NextResponse(buffer);
  } catch (error) {
    console.error("Error generating speech from text: ", error);
  }
}
