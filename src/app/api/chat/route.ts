import { NextRequest, NextResponse } from "next/server";

import OpenAI, { ClientOptions } from "openai";

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
`;

export async function POST(req: NextRequest) {
  const { content, temperature } = await req.json();
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: content },
    ],
    temperature: temperature || 0.5,
  });
  return NextResponse.json({
    text: response.choices[0].message.content,
  });
}
