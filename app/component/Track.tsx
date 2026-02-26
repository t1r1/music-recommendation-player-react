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
  // comes from backend (GET /evaluations merged into tracks)
  // 1 = liked, -1 = disliked, 0 or undefined = no evaluation yet
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
    >
      <span className="flex-1 leading-6">
        {showPause ? (
          <button type="button" onClick={() => onPause(track)}>
            <FontAwesomeIcon
              icon={faPause}
              className="cursor-pointer mr-4 shrink-0 w-5 h-5 text-md text-black hover:text-gray-700"
            />
          </button>
        ) : (
          <button type="button" onClick={() => onPlay(track)}>
            <FontAwesomeIcon
              icon={faPlay}
              className="group-hover:text-black cursor-pointer mr-4 shrink-0 w-5 h-5 text-md dark:text-gray-100 text-black hover:text-gray-700"
            />
          </button>
        )}
        {artist} - {title}
      </span>

      <span className="text-sm bg-sky-50 dark:text-gray-800 font-mono px-1 rounded-md rounded-lg">
        {genre}
      </span>

      <div className="ml-4 flex">
        <button
          type="button"
          onClick={() => handleEvaluate(1)}
          disabled={isSubmitting}
          aria-label="Like this track"
        >
          <FontAwesomeIcon
            icon={faThumbsUp}
            className={`cursor-pointer mr-2 shrink-0 w-5 h-5 text-md hover:text-gray-700 ${
              likedState === 1 ? "text-green-600" : "text-[#a8a29e]"
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() => handleEvaluate(-1)}
          disabled={isSubmitting}
          aria-label="Dislike this track"
        >
          <FontAwesomeIcon
            icon={faThumbsDown}
            className={`cursor-pointer shrink-0 w-5 h-5 text-md hover:text-gray-700 ${
              likedState === -1 ? "text-red-600" : "text-[#a8a29e]"
            }`}
          />
        </button>
      </div>
    </li>
  );
}
