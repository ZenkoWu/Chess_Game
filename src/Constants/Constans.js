import { colors, pieces } from "./figureTypes";

export const maxBoardWidth = 8;
export const maxBoardHeight = 8;
const letterACodeInASCII = 65;
export const numbersAxis = Array.from( { length: maxBoardHeight },(_, i) => maxBoardHeight - i);
export const lettersAxis = Array.from({ length: maxBoardWidth }, (_, i) =>String.fromCharCode(i + letterACodeInASCII));
export const arrDefaultFigurePosition = [
    { start: 0, xOffsetBetweenFigures: 1, type: pieces.PAWN, color: colors.BLACK, y: 6 },
    { start: 0, xOffsetBetweenFigures: 1, type: pieces.PAWN, color: colors.WHITE, y: 1 },
    { start: 4, xOffsetBetweenFigures: 4, type: pieces.KING, color: colors.BLACK, y: 7 },
    { start: 4, xOffsetBetweenFigures: 4, type: pieces.KING, color: colors.WHITE, y: 0 },
    { start: 3, xOffsetBetweenFigures: 5, type: pieces.QUEEN, color: colors.BLACK, y: 7 },
    { start: 3, xOffsetBetweenFigures: 5, type: pieces.QUEEN, color: colors.WHITE, y: 0 },
    { start: 1, xOffsetBetweenFigures: 5, type: pieces.KNIGHT, color: colors.BLACK, y: 7 }, 
    { start: 1, xOffsetBetweenFigures: 5, type: pieces.KNIGHT, color: colors.WHITE, y: 0 },
    { start: 2, xOffsetBetweenFigures: 3, type: pieces.BISHOP, color: colors.BLACK, y: 7 },
    { start: 2, xOffsetBetweenFigures: 3, type: pieces.BISHOP, color: colors.WHITE, y: 0 },
    { start: 0, xOffsetBetweenFigures: 7, type: pieces.ROOK, color: colors.BLACK, y: 7 },
    { start: 0, xOffsetBetweenFigures: 7, type: pieces.ROOK, color: colors.WHITE, y: 0 },
];

export const figuresInitialState = Array.from({ length: 32 }, (_, i) => ({
    id: i + 1,
    color: i < 16 ? colors.BLACK : colors.WHITE,
    type: (
        (pieces.ROOK + ' ').repeat(2) +
        (pieces.KNIGHT + ' ').repeat(2) +
        (pieces.BISHOP + ' ').repeat(2) +
        (pieces.QUEEN + ' ') +
        (pieces.KING + ' ') +
        (pieces.PAWN + ' ').repeat(8)
    ).split(' ')[i % (maxBoardWidth * 2)],
    })
)