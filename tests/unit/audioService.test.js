import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioService } from '@/lib/audio/audioService';

describe('AudioService', () => {
  beforeEach(() => {
    audioService.setMuted(false);
  });

  it('allows toggling mute state', () => {
    audioService.setMuted(true);
    expect(audioService.isMuted).toBe(true);

    audioService.setMuted(false);
    expect(audioService.isMuted).toBe(false);
  });

  it('safely handles playback in environments without Web Audio API without throwing', () => {
    // In node/jsdom test environments where AudioContext might not exist
    expect(() => audioService.playPlant()).not.toThrow();
    expect(() => audioService.playZombie()).not.toThrow();
    expect(() => audioService.playWin()).not.toThrow();
    expect(() => audioService.playDraw()).not.toThrow();
    expect(() => audioService.playUndo()).not.toThrow();
  });

  it('does nothing when muted', () => {
    audioService.setMuted(true);
    const spy = vi.spyOn(audioService, '_getContext');
    audioService.playPlant();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
