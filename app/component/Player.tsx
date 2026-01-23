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
  audioRef: HTMLAudioElement | null;
};
export default function Player({ currentTrack, audioRef }: PlayerProps) {
  return (
    <div className="flex items-center mt-4">
      {currentTrack ? (
        <div className="overflow-hidden whitespace-nowrap text-ellipsis text-center text-sm max-w-[200px] mr-3">
          {currentTrack.artist} - {currentTrack.title}
        </div>
      ) : (
        <div className="text-center max-w-[200px] mr-3 text-sm"></div>
      )}
      <FontAwesomeIcon icon={faBackwardStep} />
      <audio
        ref={audioRef}
        controls
        preload="none"
        src={currentTrack?.filepath}
      >
        Your browser does not support the audio element.
      </audio>
      <FontAwesomeIcon icon={faForwardStep} />
    </div>
  );
}
