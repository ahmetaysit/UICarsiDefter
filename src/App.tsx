/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { Component } from "react";
import Login from "./pages/login/Login";
import {Route, Switch } from "react-router-dom";
import Home from "./pages/main/Home";
import NotFound from "./pages/NotFound";
import PrivateRouter from "./components/PrivateRouter";
import axios from "axios";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as loadingActions from "./store/actions/loadingActions";
import * as loginActions from "./store/actions/loginActions";

var activeRequestCount = 0;

class App extends Component {
  constructor(props) {
    super(props);

    axios.interceptors.request.use(
      function (config) {
        activeRequestCount++;
        if (activeRequestCount === 1) props.actions.setIsLoading(true);

        var context = localStorage.getItem("userContext");
        config.headers["Content-Type"] = "application/json";
        if (context !== null) {
          var user = JSON.parse(context);

          config.headers.Authorization = "Bearer " + user.token;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        activeRequestCount--;
        if (activeRequestCount === 0) {
          props.actions.setIsLoading(false);
        }

        return response;
      },
      (error) => {
        activeRequestCount--;
        if (activeRequestCount === 0) {
          props.actions.setIsLoading(false);
        }
        return Promise.reject(error);
      }
    );

    this.state = {
      data: {},
      users: [],
    };
  }

  isLoggedIn(): boolean {
    return false;
  }
  render() {
    return (
      <div>
          <div className={"main-container"}>
            <Switch>
              <Route path="/login" component={Login} />
              <PrivateRouter path="/" component={Home}></PrivateRouter>
              <PrivateRouter exact path="/" component={Home}></PrivateRouter>
              <Route component={NotFound} />
            </Switch>
          </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    usercontext: state.loginReducer,
    sideNavIsOpen: state.sideNavReducer,
    isLoading: state.loadingReducer,
    totalRequest: state.totalRequestReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      login: bindActionCreators(loginActions.login, dispatch),
      logout: bindActionCreators(loginActions.logout, dispatch),
      setLoginContext: bindActionCreators(
        loginActions.setLoginContext,
        dispatch
      ),
      setIsLoading: bindActionCreators(loadingActions.setIsLoading, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
