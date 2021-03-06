import { minesweeper, MinesweeperState } from './minesweeper';
import { GAME_STATUS, SQUARE_STATUS } from "../constants";
import { revealSquare, flagSquare } from "../actions/creators";

const TEST_STATE_1: MinesweeperState = {
    bombSquares: {0: 3},
    areBombSquaresInitialized: true,
    squares: Object.assign({}, Array(2 * 2).fill({
        status: SQUARE_STATUS.HIDDEN
    })),
    numBombsFlagged: 0,
    numSquaresCleared: 0,
    gameStatus: GAME_STATUS.IN_PROGRESS,
    numBombs: 1,
    numRows: 2,
    numCols: 2,
};

describe("test 2x2 board", () => {
    test("win the game", () => {
        // Clear the squares that don't have bombs.
        const afterClick0 = minesweeper(TEST_STATE_1, revealSquare(0));
        expect(afterClick0.squares[0].status).toBe(SQUARE_STATUS.CLEARED);
        expect(afterClick0.squares[0].count).toBe(1);
        const afterClick1 = minesweeper(afterClick0, revealSquare(1));
        expect(afterClick1.squares[1].status).toBe(SQUARE_STATUS.CLEARED);
        expect(afterClick1.squares[1].count).toBe(1);
        const afterClick2 = minesweeper(afterClick1, revealSquare(2));
        expect(afterClick2.squares[2].status).toBe(SQUARE_STATUS.CLEARED);
        expect(afterClick2.squares[2].count).toBe(1);
        // Flag the only bomb.
        const afterFlag = minesweeper(afterClick2, flagSquare(3));
        expect(afterFlag.squares[3].status).toBe(SQUARE_STATUS.FLAGGED);
        expect(afterFlag.gameStatus).toBe(GAME_STATUS.WON);
    });

    test("click on the bomb", () => {
        expect(minesweeper(TEST_STATE_1, revealSquare(3)).gameStatus)
            .toBe(GAME_STATUS.LOST);
    });
});

const TEST_STATE_2: MinesweeperState = {
    bombSquares: {0: 2, 1: 8},
    areBombSquaresInitialized: true,
    squares: Object.assign({}, Array(3 * 3).fill({
        status: SQUARE_STATUS.HIDDEN
    })),
    numBombsFlagged: 0,
    numSquaresCleared: 0,
    gameStatus: GAME_STATUS.IN_PROGRESS,
    numBombs: 2,
    numRows: 3,
    numCols: 3,
};

describe("test 3x3 board", () => {
    test("winning strategy 1", () => {
        const finalState = [
            revealSquare(3), revealSquare(5), flagSquare(2),
            flagSquare(8),
        ].reduce((state, action) => minesweeper(state, action), TEST_STATE_2);
        expect(finalState.gameStatus).toBe(GAME_STATUS.WON);
    });

    test("winning strategy 2", () => {
        const finalState = [
            revealSquare(1), revealSquare(5),
            flagSquare(3), flagSquare(3), // Undo the flag operation.
            revealSquare(3), flagSquare(2), flagSquare(8),
        ].reduce((state, action) => minesweeper(state, action), TEST_STATE_2);
        expect(finalState.gameStatus).toBe(GAME_STATUS.WON);
    });

    test("click on the bomb 1", () => {
        expect(minesweeper(TEST_STATE_2, revealSquare(2)).gameStatus)
            .toBe(GAME_STATUS.LOST);
    });
});
