import { AuthAction } from "../actions";

const initialState = {
  firstTime: true,
  sessionId: null,
  sessionRefreshId: null,
  tokenTimeStamp: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case AuthAction.FirstTime:
      return Object.assign({}, state, {
        ...state,
        firstTime: false,
      });
    case AuthAction.LOGIN_USER:
      return Object.assign({}, state, {
        ...state,
        sessionId: action.payload.sessionId,
        sessionRefreshId: action.payload.sessionRefreshId,
        userType: action.payload.userType,
        userId: action.payload.userId,
        tokenTimeStamp: action.payload.tokenTimeStamp,
      });
    case AuthAction.GET_PROFILE:
      return Object.assign({}, state, {
        ...state,
        user: action.payload,
      });
    case AuthAction.LOGOUT_USER:
      return Object.assign({}, state, {
        ...state,
        sessionId: null,
        sessionRefreshId: null,
        tokenTimeStamp: null,
        userType: null,
        userId: null,
        user: null,
      });
    default:
      return state;
  }
};
export default AuthReducer;
