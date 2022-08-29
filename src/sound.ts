import { Howl } from "howler";

Howler.autoUnlock = false;

// https://freesound.org/people/CosmicEmbers/sounds/387479/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dartSoundUrl = require("url:./sound/387479_2895542-lq.mp3");
export const dartSound = new Howl({
  src: dartSoundUrl,
  volume: 0.85,
});

// https://freesound.org/people/philRacoIndie/sounds/551543/
// eslint-disable-next-line @typescript-eslint/no-var-requires
const errorSoundUrl = require("url:./sound/551543_8665150-lq.mp3");
export const errorSound = new Howl({
  src: errorSoundUrl,
  volume: 1,
});
