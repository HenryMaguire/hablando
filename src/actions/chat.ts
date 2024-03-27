"use server";

import { PROMPT } from "@/components/constants";
import OpenAI, { ClientOptions } from "openai";

const options: ClientOptions = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(options);

export async function getChatResponse(req: string) {
  const { messages, temperature } = JSON.parse(req);
  const allMessages = [
    { role: "system", content: PROMPT },
    ...messages.map((message: any) => {
      return { role: message.role, content: message.content };
    }),
  ];
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: allMessages,
    temperature: temperature || 0.3,
  });

  return response.choices[0].message.content as string;
}
