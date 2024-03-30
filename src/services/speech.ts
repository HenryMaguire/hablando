export const handleSpeech = async (
  text: any,
  queueAudio: (audioUrl: string) => void,
) => {
  const response = await fetch("/api/elevenlabs-tts", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  queueAudio(audioUrl);
};
