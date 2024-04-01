import { getChatResponse } from "@/actions/chat";
import { handleSpeech } from "@/services/speech";
import {
  REVIEW_SYSTEM_PROMPT,
  NEW_EXAMPLE_SYSTEM_PROMPT,
} from "@/components/constants";

const handleRequest = async (
  messages: any,
  systemPrompt: string,
  queueAudio: (audioUrl: string) => void,
  updateConversation: any
) => {
  const responseText = await getChatResponse(
    JSON.stringify({
      messages,
      systemPrompt,
    })
  );
  await handleSpeech(responseText, queueAudio);
  const newMessage = createMessage("assistant", responseText);
  updateConversation((prevConversation: any) => [
    ...prevConversation,
    newMessage,
  ]);
  return newMessage;
};

export const handleChat = async (
  conversation: any,
  updateConversation: any,
  queueAudio: (audioUrl: string) => void,
  content: string | null = null
) => {
  const isInit = content === null;
  const updatedConversation = isInit
    ? conversation
    : [...conversation, createMessage("user", content)];
  updateConversation(updatedConversation);
  try {
    const newAiMessage =
      !isInit &&
      (await handleRequest(
        updatedConversation.slice(-2),
        REVIEW_SYSTEM_PROMPT,
        queueAudio,
        updateConversation
      ));

    const reviewedMessages = newAiMessage
      ? [...updatedConversation, newAiMessage]
      : updatedConversation;

    await handleRequest(
      reviewedMessages,
      NEW_EXAMPLE_SYSTEM_PROMPT,
      queueAudio,
      updateConversation
    );
  } catch (error) {
    console.error(error);
  }
};

const createMessage = (role: string, content: string) => {
  return {
    role,
    content,
    id: new Date().getTime().toString(),
  };
};
