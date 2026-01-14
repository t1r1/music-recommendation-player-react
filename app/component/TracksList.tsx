"use client";

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
    <ul className="p-6">
      {tracks.map((t, i) => (
        <li key={i}>{t.title}</li>
      ))}
    </ul>
  );
}
