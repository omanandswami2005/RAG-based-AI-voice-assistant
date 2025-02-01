/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";

const TextToSpeech = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(() => parseFloat(localStorage.getItem("pitch")) || 1);
  const [rate, setRate] = useState(() => parseFloat(localStorage.getItem("rate")) || 1);
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem("volume")) || 1);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setVoice(voices.find((v) => v.lang.includes("en")) || voices[0]);
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  useEffect(() => {
    localStorage.setItem("pitch", pitch);
  }, [pitch]);

  useEffect(() => {
    localStorage.setItem("rate", rate);
  }, [rate]);

  useEffect(() => {
    localStorage.setItem("volume", volume);
  }, [volume]);

  useEffect(() => {
    handlePlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

  const speakInChunks = (text) => {
    const synth = window.speechSynthesis;
    synth.cancel(); // Prevent overlapping speech
    setIsSpeaking(true);

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]; // Split text into sentences
    let index = 0;

    const speakNext = () => {
      if (index < sentences.length) {
        const u = new SpeechSynthesisUtterance(sentences[index]);
        u.voice = voice;
        u.pitch = pitch;
        u.rate = rate;
        u.volume = volume;

        u.onend = () => {
          index++;
          speakNext();
        };

        synth.speak(u);
      } else {
        setIsSpeaking(false);
      }
    };

    speakNext();
  };

  const handlePlay = () => {
    if (text) {
      speakInChunks(text);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Voice Settings</h2>

      <div className="mb-4">
        <label className="block text-gray-600 dark:text-gray-200 mb-2">Voice:</label>
        <select
          value={voice?.name}
          onChange={(e) => setVoice(window.speechSynthesis.getVoices().find(v => v.name === e.target.value))}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {window.speechSynthesis.getVoices().map((v) => (
            <option key={v.name} value={v.name} className="text-gray-600">
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 dark:text-gray-200 mb-2">Pitch:</label>
        <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 dark:text-gray-200 mb-2">Speed:</label>
        <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 dark:text-gray-200 mb-2">Volume:</label>
        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full"
        />
      </div>

      <div className="flex gap-4">
        <button onClick={handlePlay} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          {isSpeaking ? "Speaking..." : "Play"}
        </button>
        <button onClick={handleStop} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
          Stop
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;
