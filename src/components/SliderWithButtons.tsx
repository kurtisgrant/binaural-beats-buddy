interface SliderWithButtonsProps {
  name: string;
  value: number;
  setValue: (value: number) => void;
  labeller: (name: string, value: number) => string;
  min: number;
  max: number;
  buttonInc: number;
}

export default function SliderWithButtons({
  name,
  value,
  setValue,
  labeller,
  min,
  max,
  buttonInc,
}: SliderWithButtonsProps) {
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };
  return (
    <div className="">
      <label htmlFor={name}>{labeller(name, value)}</label>
      <br />
      <div className="slider-with-buttons flex justify-center items-center mb-6 mt-2">
        <button
          style={{ 
            userSelect: "none", 
            WebkitUserSelect: "none", 
            msUserSelect: "none", 
            MozUserSelect: "none" 
          }}
          onClick={() =>
            setValue(
              Math.max(min, value - buttonInc - ((value - min) % buttonInc))
            )
          }
        >
          -
        </button>
        <input
          type="range"
          id="base"
          name="base"
          min={min.toString()}
          max={max.toString()}
          value={value}
          onChange={handleSlider}
          className="slider p-7 mx-2 w-48 md:w-64 h-2 rounded-lg appearance-none cursor-pointer bg-gray-700"
        />
        <button
          style={{ 
            userSelect: "none", 
            WebkitUserSelect: "none", 
            msUserSelect: "none", 
            MozUserSelect: "none" 
          }}
          onClick={() =>
            setValue(
              Math.min(max, value + buttonInc - ((value - min) % buttonInc))
            )
          }
        >
          +
        </button>
      </div>
    </div>
  );
}
