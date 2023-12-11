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
    if (audioCtxRef.current.state === "suspended") {
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

      oscillatorLeft
        .connect(pannerLeft)
        .connect(gainNodeRef.current)
        .connect(audioCtxRef.current.destination);
      oscillatorRight
        .connect(pannerRight)
        .connect(gainNodeRef.current)
        .connect(audioCtxRef.current.destination);

      // Set initial frequencies
      oscillatorLeft.frequency.setValueAtTime(
        hz,
        audioCtxRef.current.currentTime
      );
      oscillatorRight.frequency.setValueAtTime(
        hz + delta,
        audioCtxRef.current.currentTime
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
  }, [isPlaying, hz, delta]);

  return (
    <>
      <h1 className="text-5xl m-5 font-bold">Binaural Beats Buddy</h1>
      <button
        className="mx-auto p-5 my-8 rounded-full bg-blue-500 text-white text-2xl font-bold"
        onClick={handlePlayPause}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div className="pt-5">
        <div>
          <label htmlFor="hz">Base: {hz} Hz</label>
          <br />
          <input
            type="range"
            id="hz"
            name="hz"
            min="50"
            max="800"
            value={hz}
            onChange={(e) => setHz(Number(e.target.value))}
            className="slider p-7 m-4 w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
        <div>
          <label htmlFor="delta">Beat: {delta} Hz</label>
          <br />
          <input
            type="range"
            id="delta"
            name="delta"
            min="0"
            max="60"
            value={delta}
            onChange={(e) => setDelta(Number(e.target.value))}
            className="slider p-7 m-4 w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
      </div>
      <div>
        <small>
          {hz} Hz (Left) | {hz + delta} Hz (Right)
        </small>
      </div>
      <div className="info my-12">
        <p>
          Binaural beats are an auditory illusion perceived when two different
          pure-tone sine waves, both with frequencies lower than 1500 Hz, with
          less than a 40 Hz difference between them, are presented to a listener
          dichotically, meaning one through each ear. For example, if a 300 Hz
          tone is played in one ear and a 310 Hz tone in the other, the brain
          perceives a third tone based on the mathematical difference between
          these two tones, in this case, 10 Hz. This effect is believed to
          emerge in the superior olivary complex of the brainstem as the brain
          processes the two different frequencies.
        </p>

        <p>
          The use of binaural beats spans various purposes, primarily focused on
          creating states of relaxation, meditation, stress reduction, pain
          management, improved sleep, and even promoting creativity. They are
          categorized based on their frequency ranges and are ascribed different
          mental states or outcomes:
        </p>

        <ol>
          <li>
            <b>Delta (1-4 Hz)</b>
            <br />These frequencies are associated with deep sleep and
            are said to aid in healing and regeneration. They are often used in
            meditation and relaxation techniques to promote deep sleep.
          </li>

          <li>
            <b>Theta (4-8 Hz)</b>
            <br />Linked with REM sleep, deep meditation, and
            creativity, theta beats are used to encourage relaxation and
            creativity. They are also associated with memory, learning, and
            intuition.
          </li>

          <li>
            <b>Alpha (8-14 Hz)</b>
            <br />These frequencies are thought to promote relaxation
            while awake, such as during meditation and light hypnosis. They are
            also associated with pre-sleep and pre-wake drowsiness.
          </li>

          <li>
            <b>Beta (14-30 Hz)</b>
            <br />Associated with normal waking consciousness and a
            heightened state of alertness, logic, and critical reasoning. These
            are often used for active concentration or problem-solving tasks.
          </li>

          <li>
            <b>Gamma (30-50 Hz)</b>
            <br />These are the fastest binaural beats and are
            associated with peak concentration and high levels of cognitive
            functioning. Neuroscientists believe they are involved in higher
            mental activity, including perception and consciousness.
          </li>
        </ol>

        <p>
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
