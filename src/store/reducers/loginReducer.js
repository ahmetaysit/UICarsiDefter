import * as actionTypes from "../actions/actionTypes";
import initialStates from './initialStates';

const loginReducer = (state = initialStates.userContext, action) => {
  let newState = state;
  switch (action.type) {
    case actionTypes.LOGIN:
      localStorage.setItem("userContext", action.payload);
      return (newState = action.payload);
    case actionTypes.LOGOUT:
      localStorage.removeItem("userContext");
      return (newState = {});
    case actionTypes.SET_LOGIN_CONTEXT:
      return (newState = action.payload);
    default:
      return newState;
  }
};

export default loginReducer;
