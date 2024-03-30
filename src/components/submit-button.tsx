import styles from "@/components/chat.module.css";

export default function SubmitButton({
  isLoading,
  isRecording,
  isInitialised,
  startRecording,
  stopRecording,
  initialiseConversation,
}: {
  isLoading: boolean;
  isRecording: boolean;
  isInitialised: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  initialiseConversation: () => void;
}) {
  const getButton = () => {
    if (!isInitialised && !isLoading) {
      return { text: "Start Conversation", onClick: initialiseConversation };
    }
    if (!isInitialised && isLoading) {
      return { text: "Starting...", onClick: () => {} };
    }
    if (isLoading) {
      return { text: "Loading...", onClick: () => {} };
    } else if (isRecording) {
      return { text: "Stop Recording", onClick: stopRecording };
    } else {
      return { text: "Start Recording", onClick: startRecording };
    }
  };
  const { text: buttonText, onClick } = getButton();
  return (
    <button
      className={styles.actionButton}
      onClick={onClick}
      disabled={isLoading}
    >
      {buttonText}
    </button>
  );
}
