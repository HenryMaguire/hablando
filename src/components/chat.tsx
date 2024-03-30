import React, { useState } from "react";
import ChatList from "@/components/chat-list";
import SubmitButton from "@/components/submit-button";
import styles from "@/components/chat.module.css";

export default function ChatApp({
  conversation,
  isRecording,
  startRecording,
  stopRecording,
  initialiseConversation,
  isLoading,
}: {
  conversation: any;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  initialiseConversation: () => void;
  isLoading: boolean;
}) {
  return (
    <div className={styles.chatContainer}>
      <ChatList messages={conversation} />
      <div className={styles.buttonContainer}>
        <SubmitButton
          isLoading={isLoading}
          isRecording={isRecording}
          isInitialised={conversation.length > 0}
          startRecording={startRecording}
          stopRecording={stopRecording}
          initialiseConversation={initialiseConversation}
        />
      </div>
    </div>
  );
}
