import actualCreate from "zustand";
import { act } from "react-dom/test-utils";

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>();

// when creating a store, we get its initial state, create a reset function and add it in the set
const create = () => (createState) => {
  const store = actualCreate(createState);
  const initialState = store.getState();
  storeResetFns.add(() => store.setState(initialState, true));
  return store;
};

export const resetStores = () => {
  act(() => storeResetFns.forEach((resetFn) => resetFn()));
};

export default create;
