import { useState, useEffect } from "react";
import audioBufferToWav from "audiobuffer-to-wav";
import { GAIN } from "../constants";

interface DownloadButtonProps {
  duration: number;
  base: number;
  beat: number;
}

export default function DownloadButton({
  duration,
  base,
  beat,
}: DownloadButtonProps) {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [file, setFile] = useState<Blob | null>(null);

  useEffect(() => {
    setDownloadStarted(false);
    setFile(null);
  }, [duration, base, beat]);

  const handleRequestDownload = () => {
    const audioCtx = new AudioContext();
    setDownloadStarted(true);

    setTimeout(() => {
      const minutes = duration;
      const leftHz = base;
      const rightHz = base + beat;
      const gain = GAIN;

      const sampleRate = audioCtx.sampleRate || 44100;
      const frameCount = sampleRate * minutes * 60;
      const myArrayBuffer = audioCtx.createBuffer(2, frameCount, sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const nowBuffering = myArrayBuffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          const t = i / sampleRate;
          const freq = channel === 0 ? leftHz : rightHz;
          nowBuffering[i] = gain * Math.sin(freq * 2 * Math.PI * t); // Apply gain to reduce volume
        }
      }

      const wav = audioBufferToWav(myArrayBuffer);
      const blob = new Blob([new DataView(wav)], { type: "audio/wav" });

      setFile(blob);
      setDownloadStarted(false);
    }, 1);
  };

  return (
    <>
      {downloadStarted && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 10,
          }}
        />
      )}
      {downloadStarted ? (
        <button
          className="h-10 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded z-50"
          disabled
        >
          Generating...
        </button>
      ) : file ? (
        <button
          className="h-10 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            const url = window.URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `binaural-${base}-${beat}.wav`);
            document.body.appendChild(link);
            link.click();
          }}
        >
          Click to Download
        </button>
      ) : (
        <button
          className="h-10 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
          onClick={handleRequestDownload}
        >
          Download
        </button>
      )}
    </>
  );
}
