import { ApiAction } from "../actions";
import { configStore } from "../store";

export const dispatchAddAPI = (payload) => {
  configStore.dispatch({
    payload,
    type: ApiAction.ADD_APIDATA,
  });
};

export const dispatchRemoveAPI = (payload) => {
  configStore.dispatch({
    payload,
    type: ApiAction.REMOVE_APIDATA,
  });
};
