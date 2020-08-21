import { MinesweeperState } from "./reducers/minesweeper";

export const getSquareStatus = (state: MinesweeperState, squareId: number): number => (
    state.squares[squareId].status
);

export const getSquareCount = (state: MinesweeperState, squareId: number): number | undefined => (
    state.squares[squareId].count
);
