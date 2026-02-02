"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faThumbsUp,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
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
};

export default function Track({
  track,
  onPlay,
  onPause,
  isActive,
  isPlaying,
}: TrackProps) {
  const { id, title, artist, genre } = track;
  // only show Pause when:
  //  1. this track is the currentTrack (isActive)
  //  2. and the global player is playing (isPlaying)
  const showPause = isActive && isPlaying;
  return (
    <li
      key={id}
      className={`my-1 cursor-pointer hover:text-gray-700 flex items-center  round-sm px-1 py-2 ${isActive && "bg-amber-100 hover:bg-amber-200"}`}
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
        <FontAwesomeIcon
          icon={faThumbsUp}
          className="cursor-pointer mr-2 shrink-0 w-5 h-5 text-md text-[#4d7c0f] hover:text-gray-700"
        />
        <FontAwesomeIcon
          icon={faThumbsDown}
          className="cursor-pointer shrink-0 w-5 h-5 text-md text-[#a8a29e] hover:text-gray-700"
        />
      </div>
    </li>
  );
}
