import { useState } from "react";
import "./App.css";

function App() {
  const [hz, setHz] = useState(200);
  const [delta, setDelta] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

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
