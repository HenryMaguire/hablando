import OpenAI from "openai";
import fs from "fs";


export const config = {
  api: {
    bodyParser: false,
  },
}


const openai = new OpenAI();

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


async function saveAudioFile(audio: File, filePath: string) {
  const arrayBuffer = await audio.arrayBuffer();
  fs.writeFile(filePath, new Uint8Array(arrayBuffer), (err) => {
    if (err) {
      console.error("Error saving audio file:", err);
    } else {
      console.log("Audio file saved successfully:", filePath);
    }
  });
}

async function transcribe(filePath: string) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
  });
  return transcription.text;
}



async function generateAudio(content: string) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: content,
  });
  return Buffer.from(await mp3.arrayBuffer());
}

async function generateResponse(input: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: input },
    ],
  });
  return response.choices[0].message.content;
}

export async function POST(request: Request) {
  const inputFilePath = "input.m4a";
  const formData = await request.formData();
  const audio = formData.get("audio");
  console.log("Received audio file:", audio, typeof audio);
  saveAudioFile(audio, inputFilePath);
  console.log("File saved successfully:", inputFilePath);
  const transcribed_input = await transcribe(inputFilePath);
  const response = await generateResponse(transcribed_input);
  const output_audio = await generateAudio(response);
  return Response.json({
    audio: audio.toString("base64"),
    audioUrl: "data:audio/mp3;base64," + audio.toString("base64"),
  });
}
