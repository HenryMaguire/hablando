"use client";

import ChatApp from "@/components/chat";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { handleChat } from "@/services/chat";
import { handleSpeech } from "@/services/speech";
import { handleTranscription } from "@/services/transcription";
import { useState } from "react";

export default function Home() {
  const [audioChunks, setAudioChunks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState([]);

  const { queueAudio } = useAudioPlayer();

  const onStop = async (audioChunks: BlobPart[]) => {
    setIsRecording(false);
    setIsLoading(true);
    try {
      const transcription = await handleTranscription(audioChunks);
      const aiMessage = await handleChat(
        conversation,
        setConversation,
        transcription.text,
      );
      setIsLoading(false);
      await handleSpeech(aiMessage, queueAudio);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setAudioChunks([]);
    }
  };
  const { startRecording, stopRecording } = useMediaRecorder(
    onStop,
    setIsRecording,
  );

  const initialiseConversation = async () => {
    setIsLoading(true);
    try {
      const aiMessage = await handleChat(conversation, setConversation);
      await handleSpeech(aiMessage, queueAudio);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ChatApp
        conversation={conversation}
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        initialiseConversation={initialiseConversation}
        isLoading={isLoading}
      />
    </>
  );
}
