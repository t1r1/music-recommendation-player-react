"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type TrackData = {
  id: number;
  title: string;
  artist: string;
  genre: string;
};

type TrackProps = {
  track: TrackData;
  onPlay: (track: TrackData) => void;
  onPause: (track: TrackData) => void;
  isActive: boolean;
  isPlaying: boolean;
  userSessionId: string; // <-- pass this from higher up
};

export default function Track({
  track,
  onPlay,
  onPause,
  isActive,
  isPlaying,
  userSessionId,
}: TrackProps) {
  const { id, title, artist, genre } = track;

  // Optional: local state for quick visual feedback
  const [likedState, setLikedState] = useState<1 | -1 | 0>(0); // 1 = liked, -1 = disliked, 0 = none
  const [isSubmitting, setIsSubmitting] = useState(false);

  // only show Pause when:
  //  1. this track is the currentTrack (isActive)
  //  2. and the global player is playing (isPlaying)
  const showPause = isActive && isPlaying;

  const handleEvaluate = async (liked: 1 | -1) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      // optimistic update
      setLikedState(liked);

      const res = await fetch("/api/evaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recommendation_id: id,
          liked: liked,
        }),
      });

      if (!res.ok) {
        // if backend fails, revert optimistic change
        setLikedState(0);
        console.error("Failed to submit evaluation", await res.text());
      }
    } catch (err) {
      setLikedState(0);
      console.error("Error submitting evaluation", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <li
      key={id}
      className={`my-1 cursor-pointer hover:text-gray-700 flex items-center round-sm px-1 py-2 ${
        isActive && "bg-amber-100 hover:bg-amber-200"
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
              className="cursor-pointer mr-4 shrink-0 w-5 h-5 text-md text-black hover:text-gray-700"
            />
          </button>
        )}
        {artist} - {title}
      </span>

      <span className="text-sm bg-sky-50 font-mono px-1 rounded-md rounded-lg">
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
