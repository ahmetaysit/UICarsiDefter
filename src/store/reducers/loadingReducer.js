import * as actionTypes from "../actions/actionTypes";

const loadingReducer = (state = false, action) => {
  let newState = state;
  switch (action.type) {
    case actionTypes.SET_ISLOADING:
      return (newState = action.payload);
    default:
      return newState;
  }
};

export default loadingReducer;
