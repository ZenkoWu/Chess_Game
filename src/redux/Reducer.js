import { CHANGE_THEME } from "./actionTypes";

export const Reducer = (state, action) => {
    if(action.type === CHANGE_THEME) {
       return (state.themeColor === 'light' ? 
            {...state, themeColor: 'dark'} :
            {...state, themeColor: 'light'}
        )
    }
    return state;
} 