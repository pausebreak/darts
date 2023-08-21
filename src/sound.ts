/* eslint-disable @typescript-eslint/no-var-requires */
import isBlank from "@sedan-utils/is-blank";
import { Howl } from "howler";

// https://freesound.org/people/CosmicEmbers/sounds/387479/
const dartSoundUrl = require("url:./sound/387479_2895542-lq.mp3");
// https://freesound.org/people/philRacoIndie/sounds/551543/
const errorSoundUrl = require("url:./sound/551543_8665150-lq.mp3");
// https://freesound.org/people/MegaPenguin13/sounds/118198/
const brokenSoundUrl = require("url:./sound/118198_2043421-lq.mp3");

const sounds = () => ({
  dart: new Howl({
    src: dartSoundUrl,
  }),

  error: new Howl({
    src: errorSoundUrl,
  }),

  broken: new Howl({
    src: brokenSoundUrl,
    sprite: {
      start: [400, 1750],
    },
  }),
});

let theSounds;

// lazy initialize the sounds to avoid "The AudioContext was not allowed to start."
export const sound = () => {
  if (!theSounds) {
    theSounds = sounds();
  }

  return theSounds;
};

export const sayPhrase = (phrase: string, voiceIndex: number) => {
  const utterance = new SpeechSynthesisUtterance(phrase);

  if (!isBlank(voiceIndex)) {
    const voices = window.speechSynthesis.getVoices();
    if (voices?.length) {
      utterance.voice = voices[voiceIndex as number];
    }
  }

  // these can stack up
  // cancelling cuts any current utterance off
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};
