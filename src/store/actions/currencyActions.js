import * as actionTypes from "./actionTypes";

export const setCurrencies = (currencies) => ({
  type: actionTypes.SET_CURRENCIES,
  payload: currencies,
});
