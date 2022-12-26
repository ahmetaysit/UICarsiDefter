import * as actionTypes from "../actions/actionTypes";
import initialStates from './initialStates';

const sideNavReducer = (state = initialStates.isNavOpen, action) => {
  let newState = state;
  switch (action.type) {
    case actionTypes.SIDE_NAV_OPEN:
      return (newState = action.payload);
    case actionTypes.SIDE_NAV_CLOSE:
      return (newState = action.payload);
    default:
      return newState;
  }
};

export default sideNavReducer;
