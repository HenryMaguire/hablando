export const handleTranscription = async (audioChunks: BlobPart[]) => {
  const audioBlob = new Blob(audioChunks, {
    type: "audio/wav",
  });
  const formData = new FormData();
  formData.append("audio", audioBlob, "myRecording.wav");
  // Save the audio file to disk
  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });
  return await response.json();
};
