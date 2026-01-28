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
};

export default function TracksList({
  currentTrack,
  onPlay,
  onPause,
  onTracksChange,
  isPlaying,
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
        (item) => item.mood === currentMood, // adjust "key" if your api uses a different field
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
        const res = await fetch(
          `http://127.0.0.1:8000/api/recommendations/${foundMood.id}`,
        );

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
  }, [currentMood, moodMaps, onTracksChange]); // refetch whenever selected mood changes

  if (loading) return <p className="p-6">loading tracks…</p>;

  return (
    <ul className="px-2 md:px-4 cursor-pointer py-4">
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
