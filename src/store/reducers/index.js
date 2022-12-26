import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import sideNavReducer from "./sideNavReducer";
import loadingReducer from './loadingReducer';
import currencyReducer from './currencyReducer';

const reducers = combineReducers({
    loginReducer:loginReducer,
    sideNavReducer:sideNavReducer,
    loadingReducer:loadingReducer,
    currencyReducer:currencyReducer,
});

export default reducers;