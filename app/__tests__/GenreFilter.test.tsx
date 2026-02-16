import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GenreFilter from "../component/GenreFilter";

describe("GenreFilter", () => {
  test("selects a genre and toggles it off when clicked again", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <GenreFilter value={null} onChange={onChange} />,
    );

    // first click selects Pop
    await user.click(screen.getByRole("button", { name: "Pop" }));
    expect(onChange).toHaveBeenCalledWith("pop");

    onChange.mockClear();

    // rerender with Pop selected
    rerender(<GenreFilter value={"pop"} onChange={onChange} />);

    // clicking again should clear it
    await user.click(screen.getByRole("button", { name: "Pop" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  test("clicking All clears the selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<GenreFilter value={"rock"} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
