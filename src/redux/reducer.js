import { combineReducers } from 'redux'
import { CLEAR_HISTORY, SAVE_STATE } from './calculator'

const initialState = {
    history: []
}

const calculator = (state = initialState, action) => {
    switch (action.type) {

        case SAVE_STATE:
            return {
                ...state,
                history: state.history.concat(action.payload)
            }

        case CLEAR_HISTORY:
            return {
                ...state,
                history: []
            }

        default:
            return state
    }
}

const rootReducer = combineReducers({ calculator })

export default rootReducer