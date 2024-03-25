"use client";

import { useState } from "react";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);
    mediaRecorder.start();
    setRecording(true);
    const audioChunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      console.log("Recording stopped");
      const audioBlob = new Blob(audioChunks, {
        type: "audio/mp4",
      });
      
      const formData = new FormData();
      formData.append("audio", audioBlob);
      // Save the audio file to disk
      console.log("Sending audio to the API...");
      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      // Assume the API returns a URL to the audio to play
      new Audio(response.audio).play();
    };
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorder.stop();
  };

  return (
    <div>
      <button onClick={() => (recording ? stopRecording() : startRecording())}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
