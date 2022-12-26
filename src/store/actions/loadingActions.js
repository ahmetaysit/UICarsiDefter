import * as actionTypes from "./actionTypes";

export const setIsLoading = (isLoading) => ({
  type: actionTypes.SET_ISLOADING,
  payload: isLoading,
});
