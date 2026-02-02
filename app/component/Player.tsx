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
  return (
    <div className="text-center">
      {currentTrack ? (
        <div className="font-mono text-center overflow-hidden whitespace-nowrap text-ellipsis text-center">
          {currentTrack.artist} - {currentTrack.title}
        </div>
      ) : (
        <div className="text-center max-w-[200px] text-sm">&nbsp;</div>
      )}
      <div className="flex items-center justify-center mt-4 gap-1 md:gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className={`px-1 ${!hasPrev ? "opacity-40 cursor-default" : "hover:bg-amber-100 rounded-md cursor-pointer"}`}
        >
          <FontAwesomeIcon icon={faBackwardStep} />
        </button>

        <audio
          ref={audioRef}
          controls
          preload="none"
          src={currentTrack?.filepath}
        >
          Your browser does not support the audio element.
        </audio>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className={`px-1 ${!hasNext ? "opacity-40 cursor-default" : "hover:bg-amber-100 rounded-md cursor-pointer"}`}
        >
          <FontAwesomeIcon icon={faForwardStep} />
        </button>
      </div>
    </div>
  );
}
