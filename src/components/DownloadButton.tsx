import { useState, useEffect } from "react";
import audioBufferToWav from "audiobuffer-to-wav";

interface DownloadButtonProps {
  audioCtx: AudioContext | null;
  duration: number;
  base: number;
  beat: number;
}

export default function DownloadButton({
  audioCtx,
  duration,
  base,
  beat,
}: DownloadButtonProps) {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [file, setFile] = useState<Blob | null>(null);

  useEffect(() => {
    setDownloadStarted(false);
    setFile(null);
  }, [audioCtx, duration, base, beat]);

  const handleRequestDownload = () => {
    console.log("Preparing download...");
    setDownloadStarted(true);
    if (!audioCtx) {
      return console.log("no audioctx for download");
    }
    setTimeout(() => {
      const minutes = duration;
      const leftHz = base;
      const rightHz = base + beat;

      const sampleRate = audioCtx.sampleRate || 44100;
      console.log("sample rate: ", sampleRate);
      const frameCount = sampleRate * minutes * 60;
      const myArrayBuffer = audioCtx.createBuffer(2, frameCount, sampleRate);

      console.log("check 1", myArrayBuffer);

      for (let channel = 0; channel < 2; channel++) {
        const nowBuffering = myArrayBuffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          const t = i / sampleRate;
          const freq = channel === 0 ? leftHz : rightHz;
          nowBuffering[i] = Math.sin(freq * 2 * Math.PI * t);
        }
      }

      console.log("check 2", myArrayBuffer);

      const wav = audioBufferToWav(myArrayBuffer);

      console.log("check 3", wav);

      const blob = new Blob([new DataView(wav)], { type: "audio/wav" });

      console.log("check 4", blob);

      setFile(blob);
      setDownloadStarted(false);
    }, 1);
  };

  return downloadStarted ? (
    <button
      className="h-10 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
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
        link.setAttribute("download", "audio.wav");
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
  );
}
