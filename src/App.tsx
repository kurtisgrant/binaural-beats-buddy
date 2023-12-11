import { useState } from "react";
import { useAudioContext } from "./hooks/useAudioContext";
import { useOscillator } from "./hooks/useOscillator";
import SliderWithButtons from "./components/sliderWithButtons";
import "./App.css";

function App() {
  const [base, setBase] = useState(200);
  const [beat, setBeat] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);

  const { audioCtxRef, getAudioContext } = useAudioContext();
  useOscillator(getAudioContext, isPlaying, base, beat);

  const handlePlayPause = () => {
    // // Lazily create the AudioContext on user interaction
    if (!audioCtxRef.current) {
      audioCtxRef.current = new window.AudioContext();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <h1 className="text-5xl m-5 font-bold">Binaural Beats Buddy</h1>
      <button
        className="mx-auto p-5 my-8 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-2xl font-bold"
        onClick={handlePlayPause}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div className="pt-5">
        <SliderWithButtons
          name="base"
          value={base}
          setValue={setBase}
          labeller={baseLabeller}
          min={50}
          max={800}
          buttonInc={5}
        />
        <SliderWithButtons
          name="beat"
          value={beat}
          setValue={setBeat}
          labeller={beatLabeller}
          min={0}
          max={50}
          buttonInc={1}
        />
      </div>
      <div>
        <small>
          {base} Hz (Left) | {base + beat} Hz (Right)
        </small>
      </div>
      <div className="info my-12">
        <p>
        Binaural Beats Buddy offers a unique auditory journey, where a simple adjustment of frequencies can lead to profound changes in mental states. While the base frequency is a matter of personal taste and has no specific psychological effect, the beat frequency is the key to unlocking different brainwave patterns. Here's how it works in more relatable terms:
        </p>
        <p>
        Your brain operates at various frequencies depending on what you're doing or feeling. These frequencies are like the rhythm of your brain's activity. When you listen to a binaural beat at a specific frequency, your brain tends to match or "sync" its own rhythm with that frequency, a phenomenon known as 'brainwave entrainment'.
        </p>

        <p>
        Each beat frequency range is like a tuning dial for your mood and mental state:
        </p>

        <ol>
          <li>
            <b>Delta (1-4 Hz)</b>
            <br />
            Deep sleep and restorative rest
          </li>

          <li>
            <b>Theta (4-8 Hz)</b>
            <br />
            Meditation, intuition, and memory enhancement
          </li>

          <li>
            <b>Alpha (8-14 Hz)</b>
            <br />
            Light relaxation and pre-sleep calmness
          </li>

          <li>
            <b>Beta (14-30 Hz)</b>
            <br />
            Active, engaged thinking and focus
          </li>

          <li>
            <b>Gamma (30-50 Hz)</b>
            <br />
            Enhanced perception and problem-solving abilities
          </li>
        </ol>

        <p className="py-12">
          It is important to note that while many users anecdotally report
          positive effects of binaural beats on mental states, scientific
          research on their effectiveness is mixed and continues to evolve.
          Their use as a therapeutic tool is not universally accepted in the
          scientific community, and they are not a replacement for medical
          treatment. However, they are widely used as a non-invasive and
          drug-free method for inducing a desired mental state.
        </p>
      </div>
    </>
  );
}

export default App;

function baseLabeller(name: string, value: number) {
  return `${capitalize(name)}: ${value} Hz`;
}

function beatLabeller(name: string, value: number) {
  return `${capitalize(name)}: ${value} Hz (${getToneType(value)})`;
}

function capitalize(word: string) {
  if (word && typeof word === "string") {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  return word;
}

function getToneType(hz: number) {
  if (hz >= 30 && hz <= 50) {
    return "Gamma";
  } else if (hz >= 14 && hz <= 30) {
    return "Beta";
  } else if (hz >= 8 && hz <= 14) {
    return "Alpha";
  } else if (hz >= 4 && hz <= 8) {
    return "Theta";
  } else if (hz >= 1 && hz <= 4) {
    return "Delta";
  } else if (hz <= 0) {
    return "Not Binaural";
  } else {
    return "Unknown";
  }
}
