import { CLEAR_HISTORY, SAVE_STATE } from "./calculator"

export const saveState = newState => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: SAVE_STATE, payload: newState })
        } catch (error) { console.log(error) }
    }
}

export const clearHistory = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: CLEAR_HISTORY, payload: null })
        } catch (error) { console.log(error) }
    }
}