import { useRef } from 'react';

export function useAudioContext() {
    const audioCtxRef = useRef<AudioContext | null>(null);
  
    const getAudioContext = () => {
      if (!audioCtxRef.current) {
        // audioCtxRef.current = new window.AudioContext();
        return null
      }
  
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
  
      return audioCtxRef.current;
    };
  
    return {audioCtxRef, getAudioContext};
  }