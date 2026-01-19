"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import MoodButton from "./component/MoodButton";
import TracksList from "./component/TracksList";
import { useMood } from "@/context/MoodContext";
export default function Home() {
  const { moodMaps, currentMood, setCurrentMood } = useMood();
  const isActive = (mood: string) => {
    return mood === currentMood;
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
          <audio id="audioPlayer" controls preload="none">
            Your browser does not support the audio element.
          </audio>
          <div id="status" className="status"></div>
        </section>
        <section className="mt-1">
          <TracksList mood={currentMood} />
        </section>
      </main>
    </div>
  );
}
