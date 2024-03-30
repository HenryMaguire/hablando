import { getChatResponse } from "@/actions/chat";

export const handleChat = async (
  conversation: any,
  updateConversation: any,
  content: string | null = null,
) => {
  const updatedConversation = content
    ? [...conversation, createMessage("user", content)]
    : conversation;
  updateConversation(updatedConversation);
  try {
    const responseText = await getChatResponse(
      JSON.stringify({ messages: updatedConversation }),
    );
    updateConversation((prevConversation: any) => [
      ...prevConversation,
      createMessage("assistant", responseText),
    ]);
    return responseText;
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
