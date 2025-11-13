import { ApiAction } from '../actions';
const initialState = {
  Home: null,
  Notification: {
    status: false,
    data: null
  },
  CompanyData: null
};

const ApiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ApiAction.ADD_APIDATA:
      return Object.assign({}, state, {
        ...action.payload,
      });
    case ApiAction.REMOVE_APIDATA:
      return Object.assign({}, state, {
        ...state,
      });
    default:
      return state;
  }
};
export default ApiReducer;
