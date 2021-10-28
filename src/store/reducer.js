import * as actions from "./actionTypes";

const initialState = {
    notify: { isOpen: false, message: '', type: '' }
}

const reducer = (state = initialState, action) => {
    const newState = { ...state }
    switch (action.type) {
        case actions.SET_NOTIFICATION:
            newState.notify = action.payload.notify
            break;
        default:
            break;
    }
    return newState;
};

export default reducer