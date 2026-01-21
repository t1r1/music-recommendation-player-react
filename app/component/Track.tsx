"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

type TrackData = {
  id: string | number;
  title: string;
  artist: string;
  genre: string;
};

type TrackProps = {
  track: TrackData;
};

export default function Track({ track }: TrackProps) {
  const { id, title, artist, genre } = track;
  return (
    <li
      key={id}
      className="my-1 hover:text-gray-700 flex items-center hover:bg-stone-50 round-sm px-1 py-2"
    >
      <span className="flex-1 leading-6">
        <FontAwesomeIcon
          icon={faPlay}
          className="mr-4 shrink-0 w-5 h-5 text-md text-black hover:text-gray-700"
        />
        {artist} - {title}
      </span>

      <span className="text-sm bg-sky-50 font-mono px-1 rounded-md rounded-lg">
        {genre}
      </span>
    </li>
  );
}
