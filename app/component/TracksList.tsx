"use client";

import { useEffect, useState } from "react";
import { useMood } from "@/context/MoodContext";
import Track from "./Track";

type TrackData = {
  id: string;
  [key: string]: any;
};

// props that trackslist receives from the parent
type TracksListProps = {
  currentTrack: TrackData | null;
  onPlay: (track: TrackData) => void;
  onPause: (track: TrackData) => void;
  onTracksChange: (tracks: TrackData[]) => void;
  isPlaying: boolean;
  genre: "pop" | "rock" | "classical" | "electronic" | null;
};

export default function TracksList({
  currentTrack,
  onPlay,
  onPause,
  onTracksChange,
  isPlaying,
  genre,
}: TracksListProps) {
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);

  // get selected mood + mood configs from context
  const { currentMood, moodMaps } = useMood();

  useEffect(() => {
    let cancelled = false;

    const fetchTracks = async () => {
      setLoading(true);

      // find the mood definition that matches currentMood
      const foundMood = moodMaps.moods.find(
        (item) => item.mood === currentMood,
      );

      // if we didn't find a matching mood, clear tracks and stop
      if (!foundMood) {
        if (!cancelled) {
          setTracks([]);
          onTracksChange([]);
          setLoading(false);
        }
        return;
      }

      try {
        const params = new URLSearchParams();
        if (genre) params.set("genre", genre);

        const url =
          params.toString().length > 0
            ? `/api/recommendations/${foundMood.id}?${params.toString()}`
            : `/api/recommendations/${foundMood.id}`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("failed to fetch recommendations");
        }

        const data = await res.json();
        const fetchedTracks = data.tracks ?? data;

        if (!cancelled) {
          setTracks(fetchedTracks);
          onTracksChange(fetchedTracks);
          setLoading(false);
          console.log(data.tracks);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setTracks([]);
          onTracksChange([]);
          setLoading(false);
        }
      }
    };

    fetchTracks();

    return () => {
      cancelled = true;
    };
  }, [currentMood, moodMaps, onTracksChange, genre]); // refetch whenever selected mood changes

  if (loading) return <p className="p-6">loading tracks…</p>;

  return (
    <ul className="mt-5 px-2 md:px-4 cursor-pointer py-4 max-h-[400px] overflow-hidden overflow-y-scroll">
      {tracks.map((t) => (
        <Track
          key={t.id}
          track={t}
          onPlay={onPlay}
          onPause={onPause}
          isPlaying={isPlaying}
          isActive={currentTrack?.id === t.id}
        />
      ))}
    </ul>
  );
}
