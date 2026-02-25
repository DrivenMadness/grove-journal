import { useState, useCallback, useRef } from 'react';

const OPENAI_TTS_URL = 'https://api.openai.com/v1/audio/speech';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const speak = useCallback(async (textToSpeak, options = {}) => {
    if (!textToSpeak?.trim()) return;

    const voice = options.voice ?? 'shimmer';
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      setError('TTS API key not configured');
      return;
    }

    setError(null);
    setIsPlaying(true);

    try {
      const response = await fetch(OPENAI_TTS_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice,
          input: textToSpeak,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `TTS API error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      await new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setIsPlaying(false);
          resolve();
        };
        audio.onerror = (e) => {
          URL.revokeObjectURL(url);
          setIsPlaying(false);
          reject(e);
        };
        audio.play().catch(reject);
      });
    } catch (err) {
      setError(err.message || 'Failed to play response');
      setIsPlaying(false);
      throw err;
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return { speak, isPlaying, error, stop };
}
