"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
type Props = {
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
};
export default function TracksList({ mood }: Props) {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://127.0.0.1:8000/api/recommendations/7");
      const data = await res.json();
      console.log(data);
      setTracks(data.tracks);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="p-6">Loading tracks…</p>;

  return (
    <ul className="px-2 md:px-6 cursor-pointer py-4">
      {tracks.map((t, i) => (
        <li
          key={i}
          className="my-1 hover:text-gray-700 flex items-center hover:bg-stone-50 round-sm px-1 py-2"
        >
          <span className="flex-1 leading-6">
            <FontAwesomeIcon
              icon={faPlay}
              className="mr-4 shrink-0 w-5 h-5 text-md text-black hover:text-gray-700"
            />
            {t.artist} - {t.title}
          </span>

          <span className="text-sm bg-sky-50 font-mono px-1 round-md rounded-lg">
            {t.genre}
          </span>
        </li>
      ))}
    </ul>
  );
}
