import { useReducer, useCallback } from 'react';
import {
  gameReducer,
  createInitialState,
  GAME_ACTIONS,
} from '@/lib/game/gameReducer';

/**
 * Custom hook encapsulating the pure game state reducer.
 *
 * @param {Object} [initialConfig={}] - Optional initial state configuration
 * @returns {{ state: Object, dispatch: Function, actions: Object }}
 */
export function useGameReducer(initialConfig = {}) {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialConfig,
    createInitialState
  );

  const startNewGame = useCallback((options = {}) => {
    const matchId = options.matchId || `match_${Date.now()}`;
    dispatch({ type: GAME_ACTIONS.NEW_GAME, payload: { ...options, matchId } });
  }, []);

  const makeMove = useCallback((cellIndex) => {
    dispatch({ type: GAME_ACTIONS.MAKE_MOVE, payload: { cellIndex } });
  }, []);

  const undoMove = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.UNDO_MOVE });
  }, []);

  const recordMatch = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.RECORD_MATCH });
  }, []);

  const setGameMode = useCallback((gameMode) => {
    dispatch({ type: GAME_ACTIONS.SET_GAME_MODE, payload: { gameMode } });
  }, []);

  const setAiDifficulty = useCallback((aiDifficulty) => {
    dispatch({
      type: GAME_ACTIONS.SET_AI_DIFFICULTY,
      payload: { aiDifficulty },
    });
  }, []);

  const setHumanFaction = useCallback((humanFaction) => {
    dispatch({
      type: GAME_ACTIONS.SET_HUMAN_FACTION,
      payload: { humanFaction },
    });
  }, []);

  return {
    state,
    dispatch,
    actions: {
      startNewGame,
      makeMove,
      undoMove,
      recordMatch,
      setGameMode,
      setAiDifficulty,
      setHumanFaction,
    },
  };
}
