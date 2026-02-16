import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Track from "../component/Track";

describe("Track component", () => {
  const baseTrack = {
    id: 42,
    title: "Test Song",
    artist: "Test Artist",
    genre: "rock",
    liked: 0 as const,
  };

  const renderTrack = (overrides = {}) => {
    return render(
      <ul>
        <Track
          track={baseTrack}
          onPlay={vi.fn()}
          onPause={vi.fn()}
          isActive={false}
          isPlaying={false}
          userSessionId="session-1"
          {...overrides}
        />
      </ul>,
    );
  };

  //   basic rendeing

  test("renders artist, title and genre", () => {
    renderTrack();

    expect(screen.getByText("Test Artist - Test Song")).toBeInTheDocument();
    expect(screen.getByText("rock")).toBeInTheDocument();
  });

  //    play / pause behaviour                             */

  test("calls onPlay when play button clicked", async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();

    renderTrack({ onPlay });

    const playBtn = screen.getAllByRole("button")[0];
    await user.click(playBtn);

    expect(onPlay).toHaveBeenCalledWith(baseTrack);
  });

  test("calls onPause when active + playing", async () => {
    const user = userEvent.setup();
    const onPause = vi.fn();

    renderTrack({
      isActive: true,
      isPlaying: true,
      onPause,
    });

    const pauseBtn = screen.getAllByRole("button")[0];
    await user.click(pauseBtn);

    expect(onPause).toHaveBeenCalledWith(baseTrack);
  });

  //   like / dislike API behaviour

  test("sends POST /api/evaluations with liked: 1 when liking", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn(async () => ({
      ok: true,
      text: async () => "",
    }));
    vi.stubGlobal("fetch", fetchMock);

    renderTrack();

    await user.click(screen.getByRole("button", { name: "Like this track" }));

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0];

    expect(url).toBe("/api/evaluations");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);
    expect(body).toEqual({
      recommendation_id: 42,
      liked: 1,
    });

    vi.unstubAllGlobals();
  });

  test("sends POST /api/evaluations with liked: -1 when disliking", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn(async () => ({
      ok: true,
      text: async () => "",
    }));
    vi.stubGlobal("fetch", fetchMock);

    renderTrack();

    await user.click(
      screen.getByRole("button", { name: "Dislike this track" }),
    );

    const [, options] = fetchMock.mock.calls[0];

    const body = JSON.parse(options.body);
    expect(body.liked).toBe(-1);

    vi.unstubAllGlobals();
  });

  //  optimistic UI update

  test("optimistically updates like state (button becomes green)", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn(async () => ({
      ok: true,
      text: async () => "",
    }));
    vi.stubGlobal("fetch", fetchMock);

    renderTrack();

    const likeBtn = screen.getByRole("button", {
      name: "Like this track",
    });

    await user.click(likeBtn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    vi.unstubAllGlobals();
  });

  //  failure handling

  test("reverts like state if API fails", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn(async () => ({
      ok: false,
      text: async () => "error",
    }));
    vi.stubGlobal("fetch", fetchMock);

    renderTrack();

    await user.click(screen.getByRole("button", { name: "Like this track" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    vi.unstubAllGlobals();
  });
});
