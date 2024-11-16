import { SET_HISTORY, SET_WINNER, SET_TEXT, SET_STEPNUMBER, SET_SQUARES } from '../actions/index';

interface GameState {
    history: HistoryItem[];
    winner: string | null;
    text: string | null;
    stepNumber: number;
    squares: (string | null)[][];
}
interface HistoryItem {
    squares: (string | null)[][];
}
const initialState: GameState = {
    history: [],
    winner: null,
    text: null,
    stepNumber: 0,
    squares: [],
};

const gameReducer = (state = initialState, action: any): GameState => {
    switch (action.type) {
        case SET_HISTORY:
            return {
                ...state,
                history: action.payload.history,
            };
        case SET_WINNER:
            return {
                ...state,
                winner: action.payload.winner,
            };
        case SET_TEXT:
            return {
                ...state,
                text: action.payload.text,
            };
        case SET_STEPNUMBER:
            return {
                ...state,
                stepNumber: action.payload.stepNumber,
            };
        case SET_SQUARES:
            return {
                ...state,
                squares: action.payload.squares,
            };
        default:
            return state;
    }
};

export default gameReducer;
