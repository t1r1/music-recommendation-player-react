"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useMood } from "@/context/MoodContext";
import Track from "./Track";

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
  const { currentMood, moodMaps } = useMood();

  useEffect(() => {
    (async () => {
      const foundMood = moodMaps.moods.find((item) => {
        return item.mood === currentMood;
      });
      const res = await fetch(
        `http://127.0.0.1:8000/api/recommendations/${foundMood.id}`,
      );
      const data = await res.json();
      console.log(data);
      setTracks(data.tracks);
      setLoading(false);
    })();
  }, [mood]);

  if (loading) return <p className="p-6">Loading tracks…</p>;

  return (
    <ul className="px-2 md:px-6 cursor-pointer py-4">
      {tracks.map((t, i) => (
        <Track key={i} track={{ ...t }} id={i} />
      ))}
    </ul>
  );
}
