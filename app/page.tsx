"use client";
import { useEffect, useState, useRef } from "react";
import MoodButton from "./component/MoodButton";
import TracksList from "./component/TracksList";
import Player from "./component/Player";
import { useMood } from "@/context/MoodContext";

export default function Home() {
  const { moodMaps, currentMood, setCurrentMood } = useMood();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isActive = (mood: string) => {
    return mood === currentMood;
  };

  // play when track changes
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    audioRef.current.load();
    audioRef.current.play().catch(() => {});
  }, [currentTrack]);

  // 🔑 autoplay next track when current finishes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!currentTrack) return;

      const idx = tracks.findIndex((t) => t.id === currentTrack.id);
      if (idx === -1) return;

      const nextTrack = tracks[idx + 1];
      if (nextTrack) {
        setCurrentTrack(nextTrack);
      }
      // loop back to first track
      else if (tracks.length > 0) {
        setCurrentTrack(tracks[0]);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentTrack, tracks]);

  const onPlay = (trackData) => {
    setCurrentTrack(trackData);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-center py-10 px-4 md:px-16 bg-white dark:bg-black ">
        <h1 className="text-2xl">EmotiFM</h1>
        <p className="text-center mt-4"></p>My vibe Set by mood: {currentMood}
        <div className="mt-4 grid grid-cols-3 gap-4 gap-y-5 max-w-md mx-auto">
          {moodMaps.moods.map((mood) => {
            return (
              <MoodButton
                label={mood.mood}
                key={mood.id}
                mood={mood.mood}
                active={isActive(mood.mood)}
                onClick={() => setCurrentMood(mood.mood)}
              />
            );
          })}
        </div>
        <section className="mt-5">
          <Player currentTrack={currentTrack} audioRef={audioRef} />
        </section>
        <section className="mt-1">
          <TracksList
            mood={currentMood}
            onPlay={onPlay}
            currentTrack={currentTrack}
            onTracksChange={setTracks}
          />
        </section>
      </main>
    </div>
  );
}
