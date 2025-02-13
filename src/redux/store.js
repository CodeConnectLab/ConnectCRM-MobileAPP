import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import {reducers} from './reducers';

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['userReducer', 'AuthReducer', 'ApiReducer'],
  },
  reducers,
);

let middleware, composeEnhancers;
if (Platform.OS === 'ios') {
  composeEnhancers = __DEV__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;
  middleware = [
    thunk,
    // __DEV__ && createLogger(),
  ].filter(Boolean);
} else {
  composeEnhancers = compose;
  middleware = [thunk];
}
// //Middleware : Redux persist Persister
// let persister = persistStore(configStore);

const configStore = createStore(
  persistedReducer,
  composeEnhancers(...middleware),
  //composeEnhancers(applyMiddleware(...middleware))
);
const persister = persistStore(configStore);
export {configStore, persister};
