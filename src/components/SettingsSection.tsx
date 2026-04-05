import React from "react";
import isBlank from "@sedan-utils/is-blank";
import { useStore } from "../machine";

/** Sound, auto-forward, and voice settings panel used in the accordion setup flow. */
export const SettingsSection: React.FC = () => {
  const setUseSound = useStore((state) => state.setUseSound);
  const setUseAutoForward = useStore((state) => state.setUseAutoForward);
  const useSound = useStore((state) => state.useSound);
  const useAutoForward = useStore((state) => state.useAutoForward);
  const voiceIndex = useStore((state) => state.voiceIndex);
  const setVoiceIndex = useStore((state) => state.setVoiceIndex);

  const isAndroid = window?.navigator?.userAgent?.indexOf("Android") !== -1;
  const voices = window.speechSynthesis?.getVoices();

  const voiceSortCompare = (a: SpeechSynthesisVoice, b: SpeechSynthesisVoice) =>
    a.lang.localeCompare(b.lang);

  const onVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(event.target.value);
    const voice = voices?.[index];
    if (!voice) return;
    const utterance = new SpeechSynthesisUtterance(voice.name);
    utterance.voice = voice;

    setVoiceIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const toggleUseSound = () => setUseSound(!useSound);
  const toggleUseAutoForward = () => setUseAutoForward(!useAutoForward);

  return (
    <div className="options">
      <label>
        <input type="checkbox" checked={useSound} onChange={toggleUseSound} />
        Sounds ?
      </label>
      <label>
        <input type="checkbox" checked={useAutoForward} onChange={toggleUseAutoForward} />
        Auto forward to next player when idle ?
      </label>
      {useSound && !isAndroid && voices && voices.length !== 0 && (
        <div>
          <label>
            Voice{" "}
            <select
              className="voice"
              onChange={onVoiceChange}
              value={isBlank(voiceIndex) ? "" : voiceIndex}
            >
              {voices
                .slice()
                .sort(voiceSortCompare)
                .map((v) => {
                  const voiceIdx = voices.findIndex((vo) => vo.lang === v.lang && vo.name === v.name);
                  return (
                    <option key={v.name} value={voiceIdx}>
                      {v.lang} - {v.name}
                    </option>
                  );
                })}
            </select>
          </label>
        </div>
      )}
    </div>
  );
};
