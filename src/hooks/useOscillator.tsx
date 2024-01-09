import { useEffect, useRef } from "react";

export function useOscillator(
  audioCtx: AudioContext | null,
  isPlaying: boolean,
  base: number,
  beat: number
) {
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (audioCtx) {
      if (!gainNodeRef.current) {
        gainNodeRef.current = audioCtx.createGain();
        gainNodeRef.current.gain.value = 0.15;
      }

      // Create and configure oscillators and panners only if they don't exist
      if (!oscillatorLeftRef.current) {
        const pannerLeft = audioCtx.createStereoPanner();
        pannerLeft.pan.value = -1;
        oscillatorLeftRef.current = audioCtx.createOscillator();
        oscillatorLeftRef.current
          .connect(pannerLeft)
          .connect(audioCtx.createStereoPanner())
          .connect(gainNodeRef.current)
          .connect(audioCtx.destination);
        oscillatorLeftRef.current.start();
      }

      if (!oscillatorRightRef.current) {
        const pannerRight = audioCtx.createStereoPanner();
        pannerRight.pan.value = 1;
        oscillatorRightRef.current = audioCtx.createOscillator();
        oscillatorRightRef.current
          .connect(pannerRight)
          .connect(audioCtx.createStereoPanner())
          .connect(gainNodeRef.current)
          .connect(audioCtx.destination);
        oscillatorRightRef.current.start();
      }

      // Set initial frequencies
      oscillatorLeftRef.current.frequency.setValueAtTime(
        base,
        audioCtx.currentTime
      );
      oscillatorRightRef.current.frequency.setValueAtTime(
        base + beat,
        audioCtx.currentTime
      );

      // Stop oscillators when isPlaying is false
      if (!isPlaying) {
        oscillatorLeftRef.current.stop();
        oscillatorRightRef.current.stop();
        oscillatorLeftRef.current.disconnect();
        oscillatorRightRef.current.disconnect();
        oscillatorLeftRef.current = null;
        oscillatorRightRef.current = null;
      }
    }
  }, [audioCtx, isPlaying, base, beat]);

  return;
}
