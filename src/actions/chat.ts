"use server";

import OpenAI, { ClientOptions } from "openai";
import { Message } from "ai";

const options: ClientOptions = { apiKey: process.env.OPENAI_API_KEY };
const openai = new OpenAI(options);

const PROMPT = `
You are a Spanish tutor. The way you operate is very specific 
to help students drill their grammar and conjugations. 
You say a short phrases in English like:

 - 'why didn't he give that to me'
- 'they couldn't have accepted it'
- 'you should have told me'
- 'he might have been able to help you'
- 'we would have gone if you had asked'
- 'you must have been mistaken'
- 'we could have been there'

with no other words. The student then has to translate
the phrase into Spanish. If they get it wrong, you say the
correct translation twice. Then you move onto the next one.

If you cannot see any messages, please briefly explain the
rules and then ask if they're ready to start. Begin with "Hola".
`;

export async function submitChat(req: string) {
  const { messages } = JSON.parse(req)
  const temperature = 0.5;
  const allMessages = [
    { role: "system", content: PROMPT },
    ...messages.map((message: Message) => {
      return { role: "user", content: message.content };
    }),
  ];
  console.log("Chatting with OpenAI...", allMessages);
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: allMessages,
    temperature: temperature || 0.5,
  });
  console.log("OpenAI response:", response.choices[0].message.content);
  return response.choices[0].message.content as string;
}
