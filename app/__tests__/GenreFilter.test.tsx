import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GenreFilter from "../component/GenreFilter";

describe("GenreFilter", () => {
  it("selects a genre and toggles it off when clicked again", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { rerender } = render(
      <GenreFilter value={null} onChange={onChange} />,
    );

    // first click selects Pop
    await user.click(
      screen.getByRole("button", { name: /filter by pop genre/i }),
    );
    expect(onChange).toHaveBeenCalledWith("pop");

    // simulate parent updating the value prop
    rerender(<GenreFilter value="pop" onChange={onChange} />);

    // second click toggles Pop off
    await user.click(
      screen.getByRole("button", { name: /pop genre selected/i }),
    );
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it("clicking All clears the selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<GenreFilter value={"rock"} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /show all genres/i }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
