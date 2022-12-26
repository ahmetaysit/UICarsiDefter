import * as actionTypes from "./actionTypes";

export const login = (userContext) => ({
  type: actionTypes.LOGIN,
  payload:userContext
});

export const logout = () => ({
    type: actionTypes.LOGOUT,
    payload:{}
  });

export const setLoginContext = (userContext) => ({
  type: actionTypes.SET_LOGIN_CONTEXT,
  payload:userContext
})