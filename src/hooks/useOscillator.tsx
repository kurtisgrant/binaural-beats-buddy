import { useEffect, useRef } from "react";

export function useOscillator(
  getAudioContext: () => AudioContext | null,
  isPlaying: boolean,
  base: number,
  beat: number
) {
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);
  const pannerLeftRef = useRef<StereoPannerNode | null>(null);
  const pannerRightRef = useRef<StereoPannerNode | null>(null);

  useEffect(() => {
    const audioCtx = getAudioContext();

    if (audioCtx && isPlaying) {
      if (!gainNodeRef.current) {
        gainNodeRef.current = audioCtx.createGain();
        gainNodeRef.current.gain.value = 0.15;
      }

      // Create and configure oscillators and panners
      const oscillatorLeft = audioCtx.createOscillator();
      const oscillatorRight = audioCtx.createOscillator();
      const pannerLeft = audioCtx.createStereoPanner();
      const pannerRight = audioCtx.createStereoPanner();

      pannerLeft.pan.value = -1;
      pannerRight.pan.value = 1;

      oscillatorLeft
        .connect(pannerLeft)
        .connect(gainNodeRef.current)
        .connect(audioCtx.destination);
      oscillatorRight
        .connect(pannerRight)
        .connect(gainNodeRef.current)
        .connect(audioCtx.destination);

      // Set initial frequencies
      oscillatorLeft.frequency.setValueAtTime(base, audioCtx.currentTime);
      oscillatorRight.frequency.setValueAtTime(
        base + beat,
        audioCtx.currentTime
      );

      // Start oscillators
      oscillatorLeft.start();
      oscillatorRight.start();

      // Assign refs for later use in frequency update
      oscillatorLeftRef.current = oscillatorLeft;
      oscillatorRightRef.current = oscillatorRight;
      pannerLeftRef.current = pannerLeft;
      pannerRightRef.current = pannerRight;

      return () => {
        oscillatorLeft.stop();
        oscillatorRight.stop();
        oscillatorLeft.disconnect();
        oscillatorRight.disconnect();
      };
    }
  }, [getAudioContext, isPlaying, base, beat]);

  return {
    gainNodeRef,
    oscillatorLeftRef,
    oscillatorRightRef,
    pannerLeftRef,
    pannerRightRef,
  };
}
