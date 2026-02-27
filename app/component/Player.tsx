"use client";

import { RefObject } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";

type CurrentTrack = {
  id: number;
  title: string;
  artist: string;
  genre: string;
  filepath: string;
};

type PlayerProps = {
  currentTrack: CurrentTrack | null;
  audioRef: RefObject<HTMLAudioElement>;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
};

export default function Player({
  currentTrack,
  audioRef,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: PlayerProps) {
  const currentTrackLabel = currentTrack
    ? `${currentTrack.artist} – ${currentTrack.title}`
    : "No track selected";

  return (
    <div className="text-center" role="region" aria-label="Audio player">
      {currentTrack ? (
        <div
          className="font-mono text-center overflow-hidden whitespace-nowrap text-ellipsis text-center"
          aria-live="polite"
          aria-atomic="true"
          aria-label={currentTrackLabel}
        >
          {currentTrack.artist} - {currentTrack.title}
        </div>
      ) : (
        <div
          className="font-mono text-center overflow-hidden whitespace-nowrap text-ellipsis text-center"
          aria-live="polite"
          aria-atomic="true"
          aria-label={currentTrackLabel}
        >
          &nbsp;
        </div>
      )}
      <div
        className="flex px-1 items-center justify-center mt-4 gap-1 md:gap-3"
        role="group"
        aria-label="Player controls"
      >
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className={`px-1 ${
            !hasPrev
              ? "opacity-40 cursor-default"
              : "hover:bg-amber-100 rounded-md cursor-pointer"
          }`}
          aria-label="Previous track"
          aria-disabled={!hasPrev}
        >
          <FontAwesomeIcon icon={faBackwardStep} aria-hidden="true" />
        </button>

        <audio
          ref={audioRef}
          controls
          preload="none"
          src={currentTrack?.filepath}
          aria-label={
            currentTrack
              ? `Audio player for ${currentTrackLabel}`
              : "Audio player, no track selected"
          }
        >
          Your browser does not support the audio element.
        </audio>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className={`px-1 ${
            !hasNext
              ? "opacity-40 cursor-default"
              : "hover:bg-amber-100 rounded-md cursor-pointer"
          }`}
          aria-label="Next track"
          aria-disabled={!hasNext}
        >
          <FontAwesomeIcon icon={faForwardStep} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
