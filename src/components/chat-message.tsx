import { Message } from "ai";

import { IconMoon, IconUser } from "@/components/ui/icons";

export interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div {...props}>
      <div
        className={
          message.role === "user"
            ? "bg-background"
            : "bg-primary text-primary-foreground"
        }
      >
        {message.role === "user" ? <IconUser /> : <IconMoon />}
        {message.content}
      </div>
    </div>
  );
}

