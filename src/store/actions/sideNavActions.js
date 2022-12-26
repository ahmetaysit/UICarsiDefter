import * as actionTypes from "./actionTypes";

export const openSideNav = () => ({
  type: actionTypes.SIDE_NAV_OPEN,
  payload:true
});

export const closeSideNav = () => ({
    type: actionTypes.SIDE_NAV_CLOSE,
    payload:false
  });