import { actualMarksNotPointing } from "./calculations";

describe("actualMarksNotPointing", () => {
  it("handles basic input", () => {
    expect(actualMarksNotPointing(1, 0)).toBe(1);
    expect(actualMarksNotPointing(2, 0)).toBe(2);
    expect(actualMarksNotPointing(3, 0)).toBe(3);

    expect(actualMarksNotPointing(1, 1)).toBe(1);
    expect(actualMarksNotPointing(2, 1)).toBe(2);
    expect(actualMarksNotPointing(3, 1)).toBe(2);

    expect(actualMarksNotPointing(1, 2)).toBe(1);
    expect(actualMarksNotPointing(2, 2)).toBe(1);
    expect(actualMarksNotPointing(3, 2)).toBe(1);

    // out of bounds
    expect(actualMarksNotPointing(1, 3)).toBe(0);
    expect(actualMarksNotPointing(2, 3)).toBe(0);
    expect(actualMarksNotPointing(3, 3)).toBe(0);

    expect(actualMarksNotPointing(0, 0)).toBe(0);
    expect(actualMarksNotPointing(0, 3)).toBe(0);
    expect(actualMarksNotPointing(-1, -1)).toBe(0);
  });
});
