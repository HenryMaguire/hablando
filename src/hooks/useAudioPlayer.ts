import { useEffect, useState } from "react";

export const useAudioPlayer = () => {
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (audioUrl: string | undefined) => {
    const audio = new Audio(audioUrl);
    audio.play();
    setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  useEffect(() => {
    if (audioQueue.length > 0 && !isPlaying) {
      const nextAudioUrl = audioQueue[0]; // Get the first item in the queue.
      play(nextAudioUrl);
      // Remove the first item from the queue after it has been set to play.
      setAudioQueue((currentQueue) => currentQueue.slice(1));
    }
  }, [audioQueue, isPlaying]);

  const queueAudio = (audioUrl: any) => {
    setAudioQueue((currentQueue) => [...currentQueue, audioUrl]);
  };

  return { queueAudio };
};
