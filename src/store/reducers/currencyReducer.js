import * as actionTypes from "../actions/actionTypes";

const currencyReducer = (state = [], action) => {
  let newState = state;
  switch (action.type) {
    case actionTypes.SET_CURRENCIES:
      return (newState = action.payload);
    default:
      return newState;
  }
};

export default currencyReducer;
