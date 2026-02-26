import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import TracksList from "../component/TracksList";

// mock Track component to inspect props
vi.mock("../component/Track", () => ({
  default: ({ track, isActive }: any) => (
    <li
      data-testid="track-item"
      data-id={track.id}
      data-liked={track.liked}
      data-active={isActive ? "true" : "false"}
    >
      {track.title ?? `Track ${track.id}`}
    </li>
  ),
}));

//  mock useMood hook
let mockMoodValue: any = {
  currentMood: "happy",
  moodMaps: { moods: [{ id: "mood-1", mood: "happy" }] },
};

vi.mock("@/context/MoodContext", () => ({
  useMood: () => mockMoodValue,
}));

// make TS happy about global.fetch
const mockFetch = vi.fn();
(global as any).fetch = mockFetch;

describe("TracksList", () => {
  const baseProps = () => ({
    currentTrack: null,
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onTracksChange: vi.fn(),
    isPlaying: false,
    genre: null as any,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockMoodValue = {
      currentMood: "happy",
      moodMaps: { moods: [{ id: "mood-1", mood: "happy" }] },
    };
  });

  function setupSuccessfulFetch() {
    mockFetch.mockImplementation((url: RequestInfo) => {
      if (typeof url === "string" && url.startsWith("/api/recommendations/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            tracks: [
              { id: "1", title: "Walk of life" },
              { id: "2", title: "The dark side of the Moon" },
            ],
          }),
        } as Response);
      }

      if (url === "/api/evaluations") {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { recommendation_id: "1", liked: 1 },
            { recommendation_id: "2", liked: -1 },
          ],
        } as Response);
      }

      return Promise.reject(new Error(`Unexpected URL: ${String(url)}`));
    });
  }

  it("shows loading initially and then renders tracks with merged liked state", async () => {
    setupSuccessfulFetch();
    const props = baseProps();

    render(<TracksList {...props} />);

    // loading text appears first
    expect(screen.getByText(/loading tracks/i)).toBeInTheDocument();

    // then tracks appear after fetch resolves
    const items = await screen.findAllByTestId("track-item");
    expect(items).toHaveLength(2);

    // liked states from evaluations should be merged
    const first = items[0];
    const second = items[1];

    expect(first).toHaveAttribute("data-id", "1");
    expect(first).toHaveAttribute("data-liked", "1");

    expect(second).toHaveAttribute("data-id", "2");
    expect(second).toHaveAttribute("data-liked", "-1");

    // loading text gone
    expect(screen.queryByText(/loading tracks/i)).not.toBeInTheDocument();

    // onTracksChange called with merged tracks
    await waitFor(() => {
      expect(props.onTracksChange).toHaveBeenCalledTimes(1);
    });

    const merged = props.onTracksChange.mock.calls[0][0];
    expect(merged).toEqual([
      { id: "1", title: "Walk of life", liked: 1 },
      { id: "2", title: "The dark side of the Moon", liked: -1 },
    ]);
  });

  it("includes genre query param when genre is provided", async () => {
    setupSuccessfulFetch();

    const props = {
      ...baseProps(),
      genre: "rock" as const,
    };

    render(<TracksList {...props} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    const recUrl = mockFetch.mock.calls[0][0] as string;
    expect(recUrl).toBe("/api/recommendations/mood-1?genre=rock");
  });

  it("clears tracks and does not fetch when no matching mood is found", async () => {
    // currentMood has no matching entry in moodMaps
    mockMoodValue = {
      currentMood: "sad",
      moodMaps: { moods: [{ id: "mood-1", mood: "happy" }] },
    };

    const props = baseProps();
    render(<TracksList {...props} />);

    // no fetch calls should be made
    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
    });

    // onTracksChange should be called with empty array
    await waitFor(() => {
      expect(props.onTracksChange).toHaveBeenCalledWith([]);
    });

    // loading text should disappear
    await waitFor(() => {
      expect(screen.queryByText(/loading tracks/i)).not.toBeInTheDocument();
    });

    // no tracks rendered
    expect(screen.queryByTestId("track-item")).not.toBeInTheDocument();
  });

  it("handles fetch error by clearing tracks and calling onTracksChange([])", async () => {
    // happy mood exists so it will try to fetch
    mockMoodValue = {
      currentMood: "happy",
      moodMaps: { moods: [{ id: "mood-1", mood: "happy" }] },
    };

    // first fetch (recommendations) fails
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

    const props = baseProps();
    render(<TracksList {...props} />);

    await waitFor(() => {
      expect(props.onTracksChange).toHaveBeenCalledWith([]);
    });

    // loading text should disappear
    expect(screen.queryByText(/loading tracks/i)).not.toBeInTheDocument();

    // no track items
    expect(screen.queryByTestId("track-item")).not.toBeInTheDocument();
  });

  it("marks the currentTrack as active", async () => {
    setupSuccessfulFetch();

    const props = baseProps();
    props.currentTrack = { id: "2" } as any;

    render(<TracksList {...props} />);

    const items = await screen.findAllByTestId("track-item");
    const activeItem = items.find((el) => el.getAttribute("data-id") === "2");
    const inactiveItem = items.find((el) => el.getAttribute("data-id") === "1");

    expect(activeItem).toHaveAttribute("data-active", "true");
    expect(inactiveItem).toHaveAttribute("data-active", "false");
  });
});
