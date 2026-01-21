"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import MoodButton from "./component/MoodButton";
import TracksList from "./component/TracksList";
import { useMood } from "@/context/MoodContext";
export default function Home() {
  const { moodMaps, currentMood, setCurrentMood } = useMood();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const isActive = (mood: string) => {
    return mood === currentMood;
  };

  // play when track changes
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    audioRef.current.load();
    audioRef.current.play().catch(() => {});
  }, [currentTrack]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const onPlay = (trackData) => {
    console.log("current Track: ", trackData);
    setCurrentTrack(trackData);
    console.log("currentTrack after setting", currentTrack);
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
        {/* <FontAwesomeIcon icon={faHeart} className="text-2xl text-red-500" /> */}
        <section className="mt-5">
          <div className="flex items-center  mt-4">
            {currentTrack ? (
              <div className="overflow-hidden whitespace-nowrap text-ellipsis text-center text-sm max-w-[200px] mr-3">
                {currentTrack.artist} - {currentTrack.title}
              </div>
            ) : (
              <div className="text-center max-w-[200px] mr-3 text-sm"></div>
            )}
            <audio
              ref={audioRef}
              controls
              preload="none"
              src={currentTrack?.filepath}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        </section>
        <section className="mt-1">
          <TracksList
            mood={currentMood}
            onPlay={onPlay}
            currentTrack={currentTrack}
          />
        </section>
      </main>
    </div>
  );
}
