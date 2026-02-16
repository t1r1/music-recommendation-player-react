import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Player from "../component/Player";

describe("Player", () => {
  test("renders blank when no track and disables prev/next", () => {
    const audioRef = { current: null } as React.RefObject<HTMLAudioElement>;

    render(
      <Player
        currentTrack={null}
        audioRef={audioRef}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        hasPrev={false}
        hasNext={false}
      />,
    );

    const buttons = screen.getAllByRole("button");
    const prevBtn = buttons[0];
    const nextBtn = buttons[1];
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeDisabled();
  });

  test("shows artist - title when a track exists", () => {
    const audioRef = { current: null } as React.RefObject<HTMLAudioElement>;

    render(
      <Player
        currentTrack={{
          id: 1,
          title: "Song",
          artist: "Artist",
          genre: "pop",
          filepath: "/x.mp3",
        }}
        audioRef={audioRef}
        onPrev={() => {}}
        onNext={() => {}}
        hasPrev={true}
        hasNext={true}
      />,
    );

    expect(screen.getByText("Artist - Song")).toBeInTheDocument();
  });
});
