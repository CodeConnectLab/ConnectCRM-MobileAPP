import {combineReducers} from 'redux';
import userReducer from './UserReducer';
import AuthReducer from './AuthReducer';
import ApiReducer from './ApiReducer';

export const reducers = combineReducers({
  userReducer,
  AuthReducer,
  ApiReducer,
});
