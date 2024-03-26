"use client";

import { useState } from "react";
import { Message } from "ai";
import { submitChat } from "@/actions/chat";
import { transcribe } from "@/actions/transcribe";
import { submitTextToSpeech } from "@/actions/tts";
import { useEffect } from "react";
import ChatList from "@/components/chat-list";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [conversation, setConversation] = useState<Message[]>([]);
  let audioQueue: string[] = [];
  let isPlaying = false;

  const delay = (ms: number | undefined) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const playNextAudio = () => {
    if (audioQueue.length > 0 && !isPlaying) {
      const audioUrl = audioQueue.shift();
      const audio = new Audio(audioUrl);
      isPlaying = true;
      audio.play();
      if (!audioUrl) return;
      URL.revokeObjectURL(audioUrl);
      audio.onended = async () => {
        await delay(250);
        isPlaying = false;
        playNextAudio();
      };
    }
  };

  const handleChat = async (content: string) => {
    const messages = [
      ...conversation,
      {
        role: "user",
        content: content,
        id: "1",
      } as Message,
    ];

    const response = await submitChat(JSON.stringify(messages));

    setConversation([
      ...messages,
      {
        role: "assistant",
        content: response,
        id: "2",
      } as Message,
    ]);
  };

  const handleSpeech = async (text: string) => {
    const response = await submitTextToSpeech(text);
    if (response) {
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      audioQueue.push(audioUrl);
      if (!isPlaying) {
        playNextAudio();
      }
    }
  };

  const handleTranscription = async (audioChunks: BlobPart[]) => {
    console.log("Transcribing audio...");
    const audioBlob = new Blob(audioChunks, {
      type: "audio/wav",
    });
    
    const file = new File([audioBlob], "filename.wav", { type: "audio/wav" });
    console.log("Really Transcribing audio...");
    return await transcribe(file);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);
    mediaRecorder.start();
    setRecording(true);
    const audioChunks: BlobPart[] = [];
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      try {
        console.log("Recording stopped");
        const transcription = await handleTranscription(audioChunks);
        console.log("Transcription:", transcription);
        await handleChat(transcription);
        console.log("Conversation:", conversation);
        const aiMessage = conversation[conversation.length - 1];
        console.log("AI Message:", aiMessage);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  };

  const stopRecording = () => {
    setRecording(false);
    console.log("stopRecording");
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const initialiseConversation = async () => {
    console.log("initialiseConversation");
    const response = await submitChat(JSON.stringify({ messages: [] }));
    console.log("response", response);
    if (!response) return;
    await handleSpeech(response);
    setConversation([
      {
        role: "assistant",
        content: response,
        id: "0",
      } as Message,
    ]);
  };
  console.log("conversation", conversation);
  return (
    <>
      <div>
        <button onClick={() => initialiseConversation()}>
          Start Conversation
        </button>
      </div>
      <div>
        {conversation.length > 0 && (
          <button
            onClick={() => (recording ? stopRecording() : startRecording())}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </button>
        )}
      </div>
      <ChatList conversation={conversation} />
    </>
  );
}
