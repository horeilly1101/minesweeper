import updateGameState from './updateGameState';
import { GAME_STATUS, SQUARE_STATUS } from "../constants";
import { revealSquare, flagSquare } from "../actions";

const TEST_STATE_1 = {
    bombSquares: [3],
    areBombSquaresInitialized: true,
    squares: {
        0: {count: null, status: SQUARE_STATUS.HIDDEN},
        1: {count: null, status: SQUARE_STATUS.HIDDEN},
        2: {count: null, status: SQUARE_STATUS.HIDDEN},
        3: {count: null, status: SQUARE_STATUS.HIDDEN}
    },
    numBombsFlagged: 0,
    numSquaresCleared: 0,
    gameStatus: GAME_STATUS.IN_PROGRESS,
    numBombs: 1,
    numRows: 2,
    numCols: 2,
};

test("test 2x2 board", () => {
    // Clear the squares that don't have bombs.
    const afterClick0 = updateGameState(TEST_STATE_1, revealSquare(0));
    expect(afterClick0.squares[0].status).toBe(SQUARE_STATUS.CLEARED);
    expect(afterClick0.squares[0].count).toBe(1);
    const afterClick1 = updateGameState(afterClick0, revealSquare(1));
    expect(afterClick1.squares[1].status).toBe(SQUARE_STATUS.CLEARED);
    expect(afterClick1.squares[1].count).toBe(1);
    const afterClick2 = updateGameState(afterClick1, revealSquare(2));
    expect(afterClick2.squares[2].status).toBe(SQUARE_STATUS.CLEARED);
    expect(afterClick2.squares[2].count).toBe(1);
    // Flag the only bomb.
    const afterFlag = updateGameState(afterClick2, flagSquare(3));
    expect(afterFlag.squares[3].status).toBe(SQUARE_STATUS.FLAGGED);
    expect(afterFlag.gameStatus).toBe(GAME_STATUS.WON);
});
