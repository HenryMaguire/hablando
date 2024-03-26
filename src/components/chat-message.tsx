import React from 'react';
import { Message } from "ai";
import { IconMoon, IconUser } from "@/components/ui/icons";
import styles from '@/components/chat.module.css';

export function ChatMessage({ message }: { message: Message }) {
  return (
    <div className={styles.messageWrapper}>
      <div
        className={`${styles.message} ${
          message.role === "user" ? styles.userMessage : styles.aiMessage
        }`}
      >
        <span className={styles.icon}>
          {message.role === "user" ? <IconUser /> : <IconMoon />}
        </span>
        <span className={styles.content}>{message.content}</span>
      </div>
    </div>
  );
}
