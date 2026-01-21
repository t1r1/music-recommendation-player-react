"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
type TrackData = {
  id: number;
  title: string;
  artist: string;
  genre: string;
};

type TrackProps = {
  track: TrackData;
  onPlay: (track: TrackData) => void;
  isActive: boolean;
};

export default function Track({ track, onPlay, isActive }: TrackProps) {
  const { id, title, artist, genre } = track;

  return (
    <li
      key={id}
      className={`my-1 cursor-pointer hover:text-gray-700 flex items-center  round-sm px-1 py-2 ${isActive && "bg-amber-100 hover:bg-amber-200"}`}
    >
      <span className="flex-1 leading-6">
        <button type="button" onClick={() => onPlay(track)}>
          <FontAwesomeIcon
            icon={faPlay}
            className="cursor-pointer mr-4 shrink-0 w-5 h-5 text-md text-black hover:text-gray-700"
          />
        </button>
        {artist} - {title}
      </span>

      <span className="text-sm bg-sky-50 font-mono px-1 rounded-md rounded-lg">
        {genre}
      </span>
    </li>
  );
}
