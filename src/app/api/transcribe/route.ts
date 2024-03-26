import { NextRequest, NextResponse } from 'next/server'
import OpenAI, {ClientOptions} from 'openai'
const options: ClientOptions = { apiKey: process.env.OPENAI_API_KEY };

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const body = Object.fromEntries(formData)

  const openai = new OpenAI(options)

  const transcript = await openai.audio.transcriptions.create({
    file: body.audio as File,
    model: 'whisper-1',
    language: 'es',
  })
  return NextResponse.json({
    text: transcript.text,
  })
}