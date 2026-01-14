import Image from "next/image";
import MoodButton from "./component/MoodButton";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-xl">Mood-based Music Player Prototype</h1>
        <p className=""></p>
        Select your mood preference:
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto p-4">
          <MoodButton label="Joy" mood="joy" active={false}></MoodButton>
        </div>
        {/* <FontAwesomeIcon icon={faHeart} className="text-2xl text-red-500" /> */}
        <p className="options">And other options soon...</p>
        <section className="player-section">
          <div id="currentTrack" className="current-track">
            No track selected yet.
          </div>
          <button>
            <img src="back.png" width="40" height="40" />
          </button>
          <audio id="audioPlayer" controls preload="none">
            Your browser does not support the audio element.
          </audio>
          <div id="status" className="status"></div>
        </section>
        <section className="playlist">
          <div className="playlist-title">Joyful playlist</div>
          <ul id="trackList" className="track-list"></ul>
        </section>
      </main>
    </div>
  );
}
