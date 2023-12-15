interface AccordianProps {
  headerButtonText: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
}

export default function Accordian({
  headerButtonText,
  open,
  setOpen,
  children,
}: AccordianProps) {
  return (
    <>
      <button
        style={{ backgroundColor: "#242424" }}
        className="text-blue-300 italic mt-3 px-3 hover:text-blue-400 hover:font-bold"
        onClick={() => setOpen(!open)}
      >
        {open ? "▼" : "▶︎"} {headerButtonText}
      </button>
      <div className={`accordian ${open ? "accordian-open" : ""}`}>
        <div className="overflow-hidden">
          <div className="md:flex md:justify-around md:items-center p-2 py-3 border border-dashed border-gray-500 rounded-xl">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
