import { UserAction } from "../actions";
import { configStore } from "../store";

export const dispatchAddUser = (payload) => {
  configStore.dispatch({
    payload,
    type: UserAction.ADD_USER,
  });
};

export const dispatchRemoveUser = (payload) => {
  configStore.dispatch({
    payload,
    type: UserAction.REMOVE_USER,
  });
};
