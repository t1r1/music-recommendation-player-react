"use client";
import { useEffect, useState, useRef } from "react";
import MoodButton from "./component/MoodButton";
import TracksList from "./component/TracksList";
import Player from "./component/Player";
import { useMood } from "@/context/MoodContext";
import GenreFilter from "./component/GenreFilter";

type TrackData = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  filepath: string;
};

export default function Home() {
  const { moodMaps, currentMood, setCurrentMood } = useMood();
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [genre, setGenre] = useState<
    "pop" | "rock" | "classical" | "electronic" | null
  >(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isActive = (mood: string) => mood === currentMood;

  const onPlay = (track: TrackData) => {
    // if it's a different track, switch to it
    if (!currentTrack || currentTrack.id !== track.id) {
      setCurrentTrack(track);
    }
    setIsPlaying(true);
  };

  const onPause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  // helper: index of current track in the tracks array
  const currentIndex = currentTrack
    ? tracks.findIndex((t) => t.id === currentTrack.id)
    : -1;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex > -1 && currentIndex < tracks.length - 1;

  const handleNext = () => {
    if (!hasNext) return;
    const next = tracks[currentIndex + 1];
    if (!next) return;
    setCurrentTrack(next);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!currentTrack) return;

    const audio = audioRef.current;

    // UX behaviour: if we've played more than 3s of the track,
    // first press resets to start instead of going to previous track.
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (!hasPrev) {
      // no previous track; just restart this one
      if (audio) audio.currentTime = 0;
      return;
    }

    const prev = tracks[currentIndex - 1];
    if (!prev) return;

    setCurrentTrack(prev);
    setIsPlaying(true);
  };

  //  handle track changes: load new src, prepare the audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    // when the track changes, reload the audio source.
    audio.load();
  }, [currentTrack]);

  // handle playing / pausing based on isPlaying
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // ignore play() errors (autoplay restrictions etc.)
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  //  sync isPlaying with native audio events, ignore pause when it comes from an "ended" event
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      // if the audio is paused because it ended, "ended" handler will decide.
      if (audio.ended) return;
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  //  autoplay next track when current finishes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!currentTrack || tracks.length === 0) {
        setIsPlaying(false);
        return;
      }

      const idx = tracks.findIndex((t) => t.id === currentTrack.id);
      const next = tracks[idx + 1];

      if (next) {
        setCurrentTrack(next);
        setIsPlaying(true); // autoplay next
      } else {
        // no more tracks – stop playing
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrack, tracks]);

  // autoplay when a mood is chosen
  useEffect(() => {
    if (tracks.length === 0) return;

    setCurrentTrack(tracks[0]);
    setIsPlaying(true);
  }, [tracks]);

  // reset genre when current mood is changed
  useEffect(() => {
    setGenre(null);
  }, [currentMood]);

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 dark:bg-black">
      <main className="flex min-h-screen w-full max-w-2xl flex-col bg-white px-4 py-6 font-sans dark:bg-black md:px-16">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl">EmotiFM</h1>

          <p className="mt-4 text-center">
            {currentMood ? (
              <span className="font-semibold">
                my vibe set by mood: {currentMood}
              </span>
            ) : (
              <span className="font-semibold">choose your emotional vibe</span>
            )}
          </p>

          <div className="mt-4 grid w-full max-w-md grid-cols-3 gap-3 md:gap-4 gap-y-4 md:gap-y-5">
            {moodMaps.moods.map((mood) => (
              <MoodButton
                label={mood.mood}
                key={mood.id}
                mood={mood.mood}
                active={isActive(mood.mood)}
                onClick={() => setCurrentMood(mood.mood)}
              />
            ))}
          </div>

          <section className="mt-6 w-full">
            <Player
              currentTrack={currentTrack}
              audioRef={audioRef}
              onNext={handleNext}
              onPrev={handlePrev}
              hasNext={hasNext}
              hasPrev={hasPrev}
            />
          </section>

          {tracks.length > 0 ? (
            <section className="mt-4">
              <GenreFilter value={genre} onChange={setGenre} />
            </section>
          ) : (
            ""
          )}

          <section className="mt-2 w-full">
            <TracksList
              mood={currentMood}
              onPlay={onPlay}
              onPause={onPause}
              isPlaying={isPlaying}
              currentTrack={currentTrack}
              onTracksChange={setTracks}
              genre={genre}
            />
          </section>
        </div>

        <footer className="mt-auto w-full border-t border-zinc-200 pt-10 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <p className="font-medium">Disclaimer</p>

          <p className="mt-2">
            This application is a research prototype created as part of a
            Computer Science study project at the University of London. It uses
            the{" "}
            <a
              className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-200"
              href="https://www.projects.science.uu.nl/memotion/emotifydata/"
              target="_blank"
              rel="noreferrer"
            >
              emotify dataset
            </a>{" "}
            and Spotify audio features to generate experimental mood-based music
            recommendations. Recommendations are provided for research and
            demonstration purposes only and may be inaccurate. All third-party
            datasets, trademarks, and content remain the property of their
            respective owners. This project is not affiliated with, endorsed by,
            or sponsored by Spotify or the Emotify project.
          </p>

          <p className="mt-2">
            © 2025–2026 Maria Vorobeva. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
