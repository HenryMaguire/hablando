import { useState } from "react";

export const useMediaRecorder = (
  onStop: any,
  setIsRecording: (arg: boolean) => void
) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(newMediaRecorder);
    const audioChunks: BlobPart[] = [];
    newMediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    newMediaRecorder.onstop = () => onStop && onStop(audioChunks);
    newMediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  return { mediaRecorder, startRecording, stopRecording };
};
