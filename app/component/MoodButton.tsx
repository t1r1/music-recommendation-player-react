import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

type Props = {
  label: string;
  mood: "happy" | "sad" | "joy";
  active?: boolean;
};

export default function MoodButton({ label, mood, active }: Props) {
  const gradients = {
    happy: "from-amber-300 via-amber-500 to-amber-700",
    sad: "from-slate-300 via-slate-400 to-blue-400",
    joy: "from-cyan-300 via-blue-300 to-cyan-400",
  };

  return (
    <button
      id={label.toLowerCase()}
      className={`
        h-20 rounded-xl font-semibold text-white
        bg-gradient-to-r ${gradients[mood]}
        ${active ? "ring-2 ring-white scale-105" : ""}
        transition-all
      `}
    >
      <FontAwesomeIcon icon={faPlay} className="w-5 h-5 text-2xl text-white" />
      <span className="ml-4 text-white">{label}</span>
    </button>
  );
}
