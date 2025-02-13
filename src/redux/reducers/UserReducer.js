import {UserAction} from '../actions';
const initialState = {
  id: '',
  name: '',
  mobile: '',
  email: '',
  bio: '',
  gender: null,
  country_code: '',
  country_name: '',
  image: null,
  isLoggedIn: false,
  loginType: '',
  address: '',
  latitude: '',
  longitude: '',
  userType: null,
  validation: null,
  profileStatus: false,
  userData: [],
  companyData: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UserAction.ADD_USER:
      return Object.assign({}, state, {
        ...action.payload,
      });
    case UserAction.REMOVE_USER:
      return Object.assign({}, state, {
        ...state,
      });
    default:
      return state;
  }
};
export default userReducer;
