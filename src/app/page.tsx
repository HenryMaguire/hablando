"use client";

import { useState } from "react";
import { Message } from "ai";
import { getChatResponse } from "@/actions/chat";
import ChatApp from "@/components/chat";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
        id: `${conversation.length + 1}`,
      } as Message,
    ];

    const response = await getChatResponse(JSON.stringify({ messages }));
    const newMessages = [
      ...messages,
      {
        role: "assistant",
        content: response,
        id: `${conversation.length + 2}`,
      } as Message,
    ];
    setConversation(newMessages);
    return newMessages;
  };

  const handleSpeech = async (text: string) => {
    const response = await fetch("/api/tts", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    audioQueue.push(audioUrl);
    if (!isPlaying) {
      playNextAudio();
    }
  };

  const handleTranscription = async (audioChunks: BlobPart[]) => {
    const audioBlob = new Blob(audioChunks, {
      type: "audio/wav",
    });
    const formData = new FormData();
    formData.append("audio", audioBlob, "myRecording.wav");
    // Save the audio file to disk
    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });
    return await response.json();
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
        setIsLoading(true);
        const transcription = await handleTranscription(audioChunks);
        const newConversation = await handleChat(transcription.text);
        setIsLoading(false);
        const aiMessage = newConversation[newConversation.length - 1];
        await handleSpeech(aiMessage.content);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const initialiseConversation = async () => {
    setIsLoading(true);
    const response = await getChatResponse(JSON.stringify({ messages: [] }));
    setIsLoading(false);
    if (!response) return;
    setConversation([
      {
        role: "assistant",
        content: response,
        id: "0",
      } as Message,
    ]);
    await handleSpeech(response);
  };
  return (
    <>
      <ChatApp
        conversation={conversation}
        recording={recording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        initialiseConversation={initialiseConversation}
        isLoading={isLoading}
      />
    </>
  );
}
