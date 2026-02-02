"use client";

import { useEffect, useState } from "react";
import { useMood } from "@/context/MoodContext";
import Track from "./Track";

type TrackData = {
  id: string;
  title?: string;
  artist?: string;
  genre?: string;
  liked?: 1 | -1 | 0; // normalised like state for UI
  [key: string]: any;
};

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

    const fetchData = async () => {
      setLoading(true);

      // 1) find the mood definition that matches currentMood
      const foundMood = moodMaps.moods.find(
        (item: any) => item.mood === currentMood,
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
        // 2) build recommendations URL (optionally with genre)
        const params = new URLSearchParams();
        if (genre) params.set("genre", genre);

        const url =
          params.toString().length > 0
            ? `/api/recommendations/${foundMood.id}?${params.toString()}`
            : `/api/recommendations/${foundMood.id}`;

        // 3) fetch recommendations and evaluations in parallel
        const [recsRes, evalsRes] = await Promise.all([
          fetch(url),
          fetch(`/api/evaluations`), // backend figures out user_session_id
        ]);

        if (!recsRes.ok) {
          throw new Error("failed to fetch recommendations");
        }
        if (!evalsRes.ok) {
          throw new Error("failed to fetch evaluations");
        }

        const recsJson = await recsRes.json();
        const evalsJson = await evalsRes.json();

        const fetchedTracks: TrackData[] = recsJson.tracks ?? recsJson;

        type Evaluation = {
          recommendation_id: string | number;
          liked: 1 | -1 | null; // can be null
        };

        const evaluations: Evaluation[] = evalsJson;

        // 4) duild lookup: recommendation_id -> liked (only 1 or -1)
        const likedById = new Map<string, 1 | -1>();
        for (const ev of evaluations) {
          if (ev.liked === 1 || ev.liked === -1) {
            likedById.set(String(ev.recommendation_id), ev.liked);
          }
          // if ev.liked is null, skip it, then no evaluation yet
        }

        // 5) merge liked info into tracks, normalising to 1 | -1 | 0
        const mergedTracks = fetchedTracks.map((t) => ({
          ...t,
          liked: likedById.get(String(t.id)) ?? 0, // 0 = neutral / none
        }));

        if (!cancelled) {
          setTracks(mergedTracks);
          onTracksChange(mergedTracks);
          setLoading(false);
          console.log("tracks with liked state", mergedTracks);
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

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [currentMood, moodMaps, onTracksChange, genre]);

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
