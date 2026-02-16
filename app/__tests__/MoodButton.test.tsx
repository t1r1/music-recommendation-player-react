import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MoodButton from "../component/MoodButton";

describe("MoodButton", () => {
  test("calls onClick and sets id to lowercased label", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<MoodButton label="Happy" mood="happy" onClick={onClick} />);

    const btn = screen.getByRole("button", { name: /happy/i });
    expect(btn).toHaveAttribute("id", "happy");

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
