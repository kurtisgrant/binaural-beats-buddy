import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [hz, setHz] = useState(200);
  const [delta, setDelta] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorLeftRef = useRef<OscillatorNode | null>(null);
  const oscillatorRightRef = useRef<OscillatorNode | null>(null);
  const pannerLeftRef = useRef<StereoPannerNode | null>(null);
  const pannerRightRef = useRef<StereoPannerNode | null>(null);
  
  const handlePlayPause = () => {
    // Lazily create the AudioContext on user interaction
    if (!audioCtxRef.current) {
      audioCtxRef.current = new window.AudioContext();
    }

    // Resume the AudioContext if it's in a suspended state
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    setIsPlaying(!isPlaying);
  };

  // Handling oscillator lifecycle
  useEffect(() => {
    if (audioCtxRef.current && isPlaying) {
      if (!gainNodeRef.current) {
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.value = 0.15; 
      }
      
      // Create and configure oscillators and panners
      const oscillatorLeft = audioCtxRef.current.createOscillator();
      const oscillatorRight = audioCtxRef.current.createOscillator();
      const pannerLeft = audioCtxRef.current.createStereoPanner();
      const pannerRight = audioCtxRef.current.createStereoPanner();

      pannerLeft.pan.value = -1;
      pannerRight.pan.value = 1;

      oscillatorLeft.connect(pannerLeft).connect(gainNodeRef.current).connect(audioCtxRef.current.destination);
      oscillatorRight.connect(pannerRight).connect(gainNodeRef.current).connect(audioCtxRef.current.destination);

      // Set initial frequencies
      oscillatorLeft.frequency.setValueAtTime(hz - delta / 2, audioCtxRef.current.currentTime);
      oscillatorRight.frequency.setValueAtTime(hz + delta / 2, audioCtxRef.current.currentTime);

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
  }, [isPlaying, hz, delta]);

  return (
    <>
      <h1 className="text-5xl font-bold">Binaural Beats Buddy</h1>
      <button
        className="mx-auto p-5 my-8 rounded-full bg-blue-500 text-white text-2xl font-bold"
        onClick={handlePlayPause}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div className="p-5">
        <div>
          <label htmlFor="hz">Hz: {hz}</label>
          <input
            type="range"
            id="hz"
            name="hz"
            min="50"
            max="800"
            value={hz}
            onChange={(e) => setHz(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="delta">Delta: {delta}</label>
          <input
            type="range"
            id="delta"
            name="delta"
            min="0"
            max="60"
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value))}
          />
        </div>
      </div>
      <div>
        <p>
          Beat Frequencies: {hz - delta / 2} Hz and {hz + delta / 2} Hz
        </p>
      </div>
    </>
  );
}

export default App;
