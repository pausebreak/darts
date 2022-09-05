import { Howl } from "howler";

// https://freesound.org/people/CosmicEmbers/sounds/387479/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dartSoundUrl = require("url:./sound/387479_2895542-lq.mp3");
export const dartSound = new Howl({
  src: dartSoundUrl,
});

// https://freesound.org/people/philRacoIndie/sounds/551543/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const errorSoundUrl = require("url:./sound/551543_8665150-lq.mp3");
export const errorSound = new Howl({
  src: errorSoundUrl,
});

// https://freesound.org/people/MegaPenguin13/sounds/118198/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const brokenSoundUrl = require("url:./sound/118198_2043421-lq.mp3");
export const brokenSound = new Howl({
  src: brokenSoundUrl,
  sprite: {
    start: [400, 1750],
  },
});
