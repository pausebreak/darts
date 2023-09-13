import React from "react";
import { render, screen } from "@testing-library/react";
import { useStore } from "../../machine";
import { resetStores } from "../../../__mocks__/zustand";
import { cricket } from "../../games";
import { TouchScoreBoard } from "./TouchScoreBoard";
import { Mark, Multiple } from "../../types";

afterEach(resetStores);

test("shows the players scores", () => {
  const player = { name: "me", darts: [] };
  const store = useStore.getState();
  store.addPlayer(player);
  store.addPlayer({ name: "person", darts: [] });
  store.setGame(cricket(true));
  store.addThrowToCurrentPlayer([Mark.Nineteen, Multiple.Single]);
  store.addThrowToCurrentPlayer([Mark.Twenty, Multiple.Triple]);
  store.addThrowToCurrentPlayer([Mark.Twenty, Multiple.Double]);

  render(<TouchScoreBoard />);
  expect(screen.getByText("me")).toBeTruthy();
  expect(screen.getByText("person")).toBeTruthy();
  expect(screen.getByText("0")).toBeTruthy();
  expect(screen.getByText("40")).toBeTruthy();
});

test("handles an odd number of players for left side", () => {
  const store = useStore.getState();
  store.addPlayer({ name: "me", darts: [] });
  store.addPlayer({ name: "person", darts: [] });
  store.addPlayer({ name: "thing", darts: [] });
  store.setGame(cricket(true));
  store.addThrowToCurrentPlayer([Mark.Nineteen, Multiple.Single]);
  store.addThrowToCurrentPlayer([Mark.Twenty, Multiple.Triple]);
  store.addThrowToCurrentPlayer([Mark.Twenty, Multiple.Double]);
  // player 2
  store.addThrowToCurrentPlayer([Mark.Nineteen, Multiple.Double]);
  store.addThrowToCurrentPlayer([Mark.Nineteen, Multiple.Triple]);

  render(<TouchScoreBoard />);
  expect(screen.getByText("me")).toBeTruthy();
  expect(screen.getByText("person")).toBeTruthy();
  expect(screen.getByText("thing")).toBeTruthy();
  expect(screen.getByText("0")).toBeTruthy();
  expect(screen.getByText("38")).toBeTruthy();
  expect(screen.getByText("40")).toBeTruthy();
});

test("handles an odd number of players for right side", () => {
  const store = useStore.getState();
  store.addPlayer({ name: "me", darts: [] });
  store.addPlayer({ name: "person", darts: [] });
  store.addPlayer({ name: "thing", darts: [] });
  store.setGame(cricket(true));
  store.addThrowToCurrentPlayer([Mark.Nineteen, Multiple.Single]);
  store.addThrowToCurrentPlayer([Mark.Twenty, Multiple.Triple]);
  store.addThrowToCurrentPlayer([Mark.Twenty, Multiple.Double]);
  // player 2
  store.addThrowToCurrentPlayer([Mark.Nineteen, Multiple.Double]);
  store.addThrowToCurrentPlayer([Mark.Nineteen, Multiple.Triple]);
  store.addThrowToCurrentPlayer([Mark.Twenty, Multiple.Triple]);
  // player 3
  store.addThrowToCurrentPlayer([Mark.Twenty, Multiple.Triple]);
  store.addThrowToCurrentPlayer([Mark.Nineteen, Multiple.Double]);
  store.addThrowToCurrentPlayer([Mark.Miss, Multiple.Single]);
  // player 1
  store.addThrowToCurrentPlayer([Mark.Miss, Multiple.Single]);

  render(<TouchScoreBoard />);
  expect(screen.getByText("me")).toBeTruthy();
  expect(screen.getByText("person")).toBeTruthy();
  expect(screen.getByText("thing")).toBeTruthy();
  expect(screen.getByText("0")).toBeTruthy();
  expect(screen.getByText("38")).toBeTruthy();
  expect(screen.getByText("40")).toBeTruthy();
});
