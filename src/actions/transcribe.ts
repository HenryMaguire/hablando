"use server";

import OpenAI, { ClientOptions } from "openai";
const options: ClientOptions = { apiKey: process.env.OPENAI_API_KEY };

export async function transcribe(audio: File) {
  console.log("Transcribing audio...");
  const openai = new OpenAI(options);
  try {
    const transcript = await openai.audio.transcriptions.create({
      file: audio as File,
      model: "whisper-1",
      language: "es",
    });
    return transcript.text;
  }
  catch (error) {
    console.error(error);
    throw new Error("Failed to transcribe audio. Please try again.");
  }
}
