import Image from "next/image";
import MoodButton from "./component/MoodButton";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black ">
        <h1 className="text-2xl">EmotiFM</h1>
        <p className="text-center mt-4"></p>My vibe Set by mood
        <div className="mt-4 grid grid-cols-3 gap-4 gap-y-5 max-w-md mx-auto">
          <MoodButton label="Joy" mood="joy" active={true}></MoodButton>
          <MoodButton label="Happy" mood="happy" active={false}></MoodButton>
          <MoodButton label="Sad" mood="sad" active={false}></MoodButton>
          <MoodButton
            label="Inspired"
            mood="inspired"
            active={false}
          ></MoodButton>
          <MoodButton label="Loving" mood="loving" active={false}></MoodButton>
          <MoodButton
            label="Sentimental"
            mood="sentimental"
            active={false}
          ></MoodButton>
          <MoodButton
            label="Relaxed"
            mood="relaxed"
            active={false}
          ></MoodButton>
          <MoodButton label="Tense" mood="tense" active={false}></MoodButton>
          <MoodButton label="Strong" mood="strong" active={false}></MoodButton>
        </div>
        {/* <FontAwesomeIcon icon={faHeart} className="text-2xl text-red-500" /> */}
        <section className="mt-5">
          <div id="currentTrack" className="">
            No track selected yet.
          </div>

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
