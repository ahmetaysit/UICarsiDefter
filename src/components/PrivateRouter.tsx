/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from "react-redux";
import * as loginActions from "../store/actions/loginActions";
import { bindActionCreators } from "redux";
import container from "../ioc/IocContainer";
import IAuthService from "../interfaces/ServiceInterfaces/IAuthService";
import TYPES from "../ioc/types";

const authService = container.get<IAuthService>(TYPES.IAuthService);

const IsLoggedIn = () => {
  return authService.isLoggedIn();
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  

  const isLoggedIn = IsLoggedIn();

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

function mapStateToProps(state) {
  return {
    usercontext: state.loginReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      login: bindActionCreators(loginActions.login, dispatch),
      setLoginContext : bindActionCreators(loginActions.setLoginContext, dispatch),
      logout: bindActionCreators(loginActions.logout, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
