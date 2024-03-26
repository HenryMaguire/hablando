import React, { useState } from "react";
import ChatList from "@/components/chat-list";
import styles from "@/components/chat.module.css";

export default function ChatApp({
  conversation,
  recording,
  startRecording,
  stopRecording,
  initialiseConversation,
  isLoading,
}) {
  const buttonLabel = (isLoading, recording) => {
    if (isLoading) {
      return "Loading...";
    } else if (recording) {
      return "Stop Recording";
    } else {
      return "Start Recording";
    }
  };
  return (
    <div className={styles.chatContainer}>
      <ChatList messages={conversation} />
      <div className={styles.buttonContainer}>
        {conversation.length > 0 ? (
          <button
            className={styles.actionButton}
            onClick={() => (recording ? stopRecording() : startRecording())}
            disabled={isLoading}
          >
            {buttonLabel(isLoading, recording)}
          </button>
        ) : (
          <button
            className={styles.actionButton}
            onClick={initialiseConversation}
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Start Conversation"}
          </button>
        )}
      </div>
    </div>
  );
}
