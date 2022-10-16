import React from "react";
import { render, screen } from "@testing-library/react";
import { useStore } from "../../machine";
import { resetStores } from "../../../__mocks__/zustand";
import { cricket } from "../../games";
import { Cricket } from "./Cricket";

afterEach(resetStores);

test("shows nothing if no game", () => {
  const store = useStore.getState();
  store.addPlayer({ name: "person", darts: [] });

  render(<Cricket />);
  expect(screen.queryByText("person")).not.toBeTruthy();
});

test("shows something with game", () => {
  const store = useStore.getState();
  store.setGame(cricket(true));
  store.addPlayer({ name: "person", darts: [] });

  render(<Cricket />);
  expect(screen.getByText("person")).toBeTruthy();
});
