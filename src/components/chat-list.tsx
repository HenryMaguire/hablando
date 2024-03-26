import React, { useEffect, useRef } from "react";
import { type Message } from "ai";
import { ChatMessage } from "@/components/chat-message";

export interface ChatList {
  messages: Message[];
}

export default function ChatList({ messages }: ChatList) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || !messages.length) {
    return null;
  }

  return (
    <div
      className="relative mx-auto max-w-2xl px-4 overflow-auto"
      style={{ maxHeight: "70vh" }}
    >
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
