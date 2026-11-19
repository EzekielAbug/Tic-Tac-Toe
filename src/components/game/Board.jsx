"use client";

import Cell from "./Cell";

/**
 * Board component
 * Renders the 3×3 garden lawn grid.
 *
 * @param {Object} props
 * @param {Array<string|null>} props.board - 9-element array
 * @param {number[]|null} props.winningLine - Winning cell indices or null
 * @param {boolean} props.isGameOver - Whether the current match has ended
 * @param {boolean} props.isAiThinking - Whether AI is currently deliberating
 * @param {Function} props.onCellClick - Callback when cell is clicked (passes cellIndex)
 */
export default function Board({
  board,
  winningLine = null,
  isGameOver = false,
  isAiThinking = false,
  onCellClick,
}) {
  return (
    <div className="board-wrapper" role="grid" aria-label="Garden Clash 3x3 Board">
      {board.map((cellValue, index) => {
        const isWinningCell = winningLine ? winningLine.includes(index) : false;
        const isDisabled = isGameOver || isAiThinking || cellValue !== null;

        return (
          <Cell
            key={index}
            index={index}
            value={cellValue}
            isWinningCell={isWinningCell}
            disabled={isDisabled}
            onClick={onCellClick}
          />
        );
      })}
    </div>
  );
}
