import { AuthAction } from '../actions'
import { configStore } from '../store';

export const dispatchFirstTime = () => {
    configStore.dispatch({
        type: AuthAction.FirstTime
    }); 
}

export const dispatchUserLogin = (payload) => {
    configStore.dispatch({
        payload,
        type: AuthAction.LOGIN_USER
    }); 
}

export const dispatchUserProfile = (payload) => {
    configStore.dispatch({
        payload,
        type: AuthAction.GET_PROFILE
    }); 
}

export const dispatchUserLogOut = (payload) => {
    configStore.dispatch({
        type: AuthAction.LOGOUT_USER
    }); 
}