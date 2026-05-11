import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { GameChooser, GameChooserState, initialChooserState } from "./GameChooser";
import { GameName } from "../types";

const withSelected = (selected: GameName): GameChooserState => ({
  ...initialChooserState,
  selected,
});

describe("GameChooser controlled behavior", () => {
  test("clicking Cricket emits onChange with selected=Cricket", () => {
    const onChange = jest.fn();
    render(<GameChooser singlePlayer={false} state={initialChooserState} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /^Cricket/ }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ selected: GameName.Cricket }));
  });

  test("clicking Tactical emits onChange with selected=Tactical", () => {
    const onChange = jest.fn();
    render(<GameChooser singlePlayer={false} state={initialChooserState} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /^Tactical/ }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ selected: GameName.Tactical }));
  });

  test.each([GameName.Cricket, GameName.Tactical])(
    "checking the pointing box emits onChange with pointing=true for %s",
    (gameName) => {
      const onChange = jest.fn();
      render(<GameChooser singlePlayer={false} state={withSelected(gameName)} onChange={onChange} />);
      fireEvent.click(screen.getByLabelText(/pointing/i));
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ pointing: true }));
    },
  );

  test.each([GameName.Cricket, GameName.Tactical])(
    "unchecking the pointing box emits onChange with pointing=false for %s",
    (gameName) => {
      const onChange = jest.fn();
      const state: GameChooserState = { ...withSelected(gameName), pointing: true };
      render(<GameChooser singlePlayer={false} state={state} onChange={onChange} />);
      fireEvent.click(screen.getByLabelText(/pointing/i));
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ pointing: false }));
    },
  );

  test.each([GameName.Cricket, GameName.Tactical])(
    "pointing checkbox reflects state.pointing for %s",
    (gameName) => {
      const onChange = jest.fn();
      const state: GameChooserState = { ...withSelected(gameName), pointing: true };
      render(<GameChooser singlePlayer={false} state={state} onChange={onChange} />);
      const checkbox = screen.getByLabelText(/pointing/i) as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    },
  );

  test("single-player disables the pointing checkbox and forces unchecked display", () => {
    const state: GameChooserState = { ...withSelected(GameName.Cricket), pointing: true };
    render(<GameChooser singlePlayer={true} state={state} onChange={jest.fn()} />);
    const checkbox = screen.getByLabelText(/pointing/i) as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
    expect(checkbox.checked).toBe(false);
  });

  test("pointing checkbox is not shown for non-pointing games", () => {
    render(
      <GameChooser
        singlePlayer={false}
        state={withSelected(GameName.Oh1)}
        onChange={jest.fn()}
      />,
    );
    expect(screen.queryByLabelText(/pointing/i)).toBeNull();
  });
});
