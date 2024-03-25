"use client";

import { useState } from "react";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
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
      const transcription = await handleTranscription(audioChunks);
      const response = await handleChat(transcription.text);
      await handleSpeech(response.text);
    };
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
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

  const handleChat = async (content: string) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ content }),
    });
    return await response.json();
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
  return (
    <div>
      <button onClick={() => (recording ? stopRecording() : startRecording())}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
