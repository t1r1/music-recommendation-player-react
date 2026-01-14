import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

type Props = {
  label: string;
  mood:
    | "happy"
    | "sad"
    | "joy"
    | "inspired"
    | "tense"
    | "strong"
    | "relaxed"
    | "sentimental"
    | "loving";
  active?: boolean;
};

export default function MoodButton({ label, mood, active }: Props) {
  const gradients = {
    happy: "from-amber-300 via-amber-500 to-amber-700",
    sad: "from-slate-300 via-slate-400 to-blue-400",
    joy: "from-cyan-300 via-blue-300 to-cyan-400",
    inspired: "from-emerald-300 via-green-400 to-teal-400",
    loving: "from-rose-400 via-pink-400 to-amber-300",
    sentimental: "from-rose-300 via-slate-300 to-indigo-300",
    relaxed: "from-teal-300 via-cyan-300 to-blue-300",
    strong: "from-red-600 via-red-500 to-amber-500",
    tense: "from-purple-500 via-violet-600 to-slate-700",
  };

  return (
    <button
      id={label.toLowerCase()}
      className={`
        hover:brightness-95 hover:-translate-y-0.5 hover:shadow-md
        active:brightness-90
        cursor-pointer w-full h-10 px-2 flex  items-center justify-center rounded-xl font-semibold text-white
        bg-gradient-to-r ${gradients[mood]}
        ${
          active
            ? "ring-2 ring-black/30 dark:ring-white/40"
            : "ring-1 ring-black/10"
        }
        transition-all
      `}
    >
      <FontAwesomeIcon
        icon={faPlay}
        className="shrink-0 w-5 h-5 text-2xl text-white"
      />
      <span className="ml-1 whitespace-nowrap text-sm leading-tight text-white">
        {label}
      </span>
    </button>
  );
}
