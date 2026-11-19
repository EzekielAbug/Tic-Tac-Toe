import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage/localStorage';
import { audioService } from '@/lib/audio/audioService';

/**
 * Custom hook to control sound playback and persist mute preference.
 *
 * @returns {{
 *   isSoundEnabled: boolean,
 *   toggleSound: Function,
 *   playPlant: Function,
 *   playZombie: Function,
 *   playWin: Function,
 *   playDraw: Function,
 *   playUndo: Function
 * }}
 */
export function useAudio() {
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage(
    STORAGE_KEYS.SOUND,
    true
  );

  useEffect(() => {
    audioService.setMuted(!isSoundEnabled);
  }, [isSoundEnabled]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => !prev);
  }, [setIsSoundEnabled]);

  const playPlant = useCallback(() => {
    audioService.playPlant();
  }, []);

  const playZombie = useCallback(() => {
    audioService.playZombie();
  }, []);

  const playWin = useCallback(() => {
    audioService.playWin();
  }, []);

  const playDraw = useCallback(() => {
    audioService.playDraw();
  }, []);

  const playUndo = useCallback(() => {
    audioService.playUndo();
  }, []);

  return {
    isSoundEnabled,
    toggleSound,
    playPlant,
    playZombie,
    playWin,
    playDraw,
    playUndo,
  };
}
