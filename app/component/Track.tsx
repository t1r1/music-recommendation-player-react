"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

type TrackData = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  liked?: 1 | -1 | 0;
};

type TrackProps = {
  track: TrackData;
  onPlay: (track: TrackData) => void;
  onPause: (track: TrackData) => void;
  isActive: boolean;
  isPlaying: boolean;
  userSessionId: string;
};

export default function Track({
  track,
  onPlay,
  onPause,
  isActive,
  isPlaying,
}: TrackProps) {
  const { id, title, artist, genre, liked } = track;

  // Local state for UI (initialised from props, and kept in sync)
  const [likedState, setLikedState] = useState<1 | -1 | 0>(liked ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // keep local state in sync if parent refetches data / mood changes
  useEffect(() => {
    setLikedState(liked ?? 0);
  }, [liked]);

  // only show Pause when:
  //  1. this track is the currentTrack (isActive)
  //  2. and the global player is playing (isPlaying)
  const showPause = isActive && isPlaying;

  const handleEvaluate = async (newLiked: 1 | -1) => {
    if (isSubmitting) return;

    const payloadLiked = newLiked;

    try {
      setIsSubmitting(true);

      // optimistic update in UI
      setLikedState(payloadLiked);

      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recommendation_id: id,
          liked: payloadLiked,
        }),
      });

      if (!res.ok) {
        // revert if backend fails
        setLikedState(liked ?? 0);
        console.error("Failed to submit evaluation", await res.text());
      }
    } catch (err) {
      setLikedState(liked ?? 0);
      console.error("Error submitting evaluation", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackClick = (e) => {
    if (e.target.tagName === "SPAN" || e.target.tagName === "LI") {
      if (isActive) {
        onPause(track);
      } else {
        onPlay(track);
      }
    }
  };

  return (
    <li
      key={id}
      onClick={handleTrackClick}
      data-test-id="track-item"
      className={`group my-1 cursor-pointer flex items-center round-sm px-1 py-2 dark:hover:bg-amber-50 dark:hover:text-black ${
        isActive ? "bg-amber-300 text-black" : "hover:bg-teal-100"
      }`}
      role="listitem"
      aria-current={isActive ? "true" : undefined}
      aria-label={`${artist} – ${title}`}
    >
      <span className="flex-1 leading-6 cursor-pointer">
        {showPause ? (
          <button
            type="button"
            onClick={() => onPause(track)}
            aria-label={`Pause ${artist} – ${title}`}
            aria-pressed={showPause}
          >
            <FontAwesomeIcon
              icon={faPause}
              className="cursor-pointer mr-4 shrink-0 w-5 h-5 text-md text-black hover:text-gray-700"
              aria-hidden="true"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onPlay(track)}
            aria-label={`Play ${artist} – ${title}`}
            aria-pressed={showPause}
          >
            <FontAwesomeIcon
              icon={faPlay}
              className="group-hover:text-black cursor-pointer mr-4 shrink-0 w-5 h-5 text-md dark:text-gray-100 text-black hover:text-gray-700"
              aria-hidden="true"
            />
          </button>
        )}
        {artist} - {title}
      </span>

      <span
        className="text-sm bg-sky-50 dark:text-gray-800 font-mono px-1 rounded-md rounded-lg"
        aria-label={`Genre: ${genre}`}
      >
        {genre}
      </span>

      <div
        className="ml-4 flex"
        role="group"
        aria-label="Rate this track"
        aria-busy={isSubmitting ? "true" : "false"}
      >
        <button
          type="button"
          onClick={() => handleEvaluate(1)}
          disabled={isSubmitting}
          aria-label={
            likedState === 1 ? "Remove like from this track" : "Like this track"
          }
          aria-pressed={likedState === 1}
          aria-disabled={isSubmitting}
        >
          <FontAwesomeIcon
            icon={faThumbsUp}
            className={`cursor-pointer mr-2 shrink-0 w-5 h-5 text-md hover:text-gray-700 ${
              likedState === 1 ? "text-green-600" : "text-[#a8a29e]"
            }`}
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={() => handleEvaluate(-1)}
          disabled={isSubmitting}
          aria-label={
            likedState === -1
              ? "Remove dislike from this track"
              : "Dislike this track"
          }
          aria-pressed={likedState === -1}
          aria-disabled={isSubmitting}
        >
          <FontAwesomeIcon
            icon={faThumbsDown}
            className={`cursor-pointer shrink-0 w-5 h-5 text-md hover:text-gray-700 ${
              likedState === -1 ? "text-red-600" : "text-[#a8a29e]"
            }`}
            aria-hidden="true"
          />
        </button>
      </div>
    </li>
  );
}
