import { useState } from "react";
import { useOscillator } from "./hooks/useOscillator";
import SliderWithButtons from "./components/SliderWithButtons";
import Accordian from "./components/Accordian";
import img from "./assets/dontforget.png";
import pause from "./assets/pause.svg";
import play from "./assets/play.svg";

import "./App.css";
import DownloadButton from "./components/DownloadButton";

function App() {
  const [base, setBase] = useState(200);
  const [beat, setBeat] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(20);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useOscillator(audioCtx, isPlaying, base, beat);

  const initAudioCtx = () => {
    if (!audioCtx) {
      setAudioCtx(new window.AudioContext());
    }
  };

  const handlePlayPause = () => {
    initAudioCtx();
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <h1 className="text-5xl text-white m-5 mb-7 font-bold">
        Binaural Beats Buddy
      </h1>
      <div className="md:flex md:justify-around align-middle p-2">
        <div className="flex flex-col items-center justify-around p-2 px-12">
          <div className="relative">
            <img
              src={img}
              alt="Don't forget headphones sticker graphic"
              className="absolute h-48 object-cover -top-24 mt-3 -left-20 pointer-events-none"
            />
            <button
              className="h-36 w-36 mx-auto p-10 rounded-full bg-blue-500 hover:bg-blue-400 shadow-2xl"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <img src={pause} className="svg-icon" alt="Pause Icon" />
              ) : (
                <img src={play} className="svg-icon" alt="Play Icon" />
              )}
            </button>
          </div>
        </div>
        <div className="p-2 pt-8 border-orange-900">
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
          <small>
            {base} Hz (Left) | {base + beat} Hz (Right)
          </small>
        </div>
      </div>
      <div>
        <Accordian
          open={downloadOpen}
          setOpen={setDownloadOpen}
          headerButtonText="Download Audio"
        >
          <SliderWithButtons
            name="duration"
            value={duration}
            setValue={setDuration}
            labeller={durationLabeller}
            min={5}
            max={90}
            buttonInc={5}
          />
          <DownloadButton duration={duration} base={base} beat={beat} />
        </Accordian>
        <Accordian
          open={aboutOpen}
          setOpen={setAboutOpen}
          headerButtonText="About"
        >
          <div className="info m-3">
            <p>
              Binaural Beats Buddy offers a unique auditory journey, where a
              simple adjustment of frequencies can lead to profound changes in
              mental states. While the base frequency is a matter of personal
              taste and has no specific psychological effect, the beat frequency
              is the key to unlocking different brainwave patterns. Here's how
              it works in more relatable terms:
            </p>
            <p>
              Your brain operates at various frequencies depending on what
              you're doing or feeling. These frequencies are like the rhythm of
              your brain's activity. When you listen to a binaural beat at a
              specific frequency, your brain tends to match or "sync" its own
              rhythm with that frequency, a phenomenon known as 'brainwave
              entrainment'.
            </p>

            <p>
              Each beat frequency range is like a tuning dial for your mood and
              mental state:
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
        </Accordian>
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

function durationLabeller(name: string, mins: number) {
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    const hourLabel = hours > 1 ? "hours" : "hour";
    return `${capitalize(name)}: ${hours} ${hourLabel}, ${remainingMins} mins`;
  } else {
    return `${capitalize(name)}: ${mins} mins`;
  }
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
