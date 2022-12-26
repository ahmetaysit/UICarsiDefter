import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as currencyActions from "../../store/actions/currencyActions";
import * as loginActions from "../../store/actions/loginActions";
import TopBar from "../../components/TopBar";
import SideNav from "../../components/SideNav";
import {Switch } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import DashBoard from "../dashboard/DashBoard";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import PrivateRouter from "../../components/PrivateRouter";
import appConfig from "../../config/appConfig";
import { Backdrop, CircularProgress } from "@material-ui/core";
import axios from "axios";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "lightgoldenrodyellow",
    height: "1000px",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    marginTop: 64,
    backgroundColor: "transparent",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
}));

function Home(props) {
  const classes = useStyles();
  useEffect(() => {
    var localstorage = localStorage.getItem("userContext");
    if (localstorage !== null) {
      var context = JSON.parse(localstorage);
      if (context.id > 0) {
        props.actions.setLoginContext(context);
      }
    }
  }, [props.actions]);
  useEffect(() => {
    axios
      .get(appConfig.baseApiUrl + "currency/GetAllCurrencies")
      .then((resJson) => props.actions.setCurrencies(resJson.data));
  }, [props.actions]);
  return (
    <div>
      <div>
        <Container fluid={true}>
          <Row>
            <Col>
                <TopBar></TopBar>
                <SideNav></SideNav>
                <main
                  className={clsx(classes.content, {
                    [classes.contentShift]: props.sideNavIsOpen,
                  })}
                >
                  <div className={"main-container"}>
                    <Switch>
                      <PrivateRouter exact path="/" component={DashBoard} />
                      {appConfig.screenList.map((item, index) => (
                        <PrivateRouter
                          key={index}
                          path={"/" + item.link}
                          component={item.component}
                        />
                      ))}
                      <PrivateRouter exact path="/home" component={DashBoard} />
                      <PrivateRouter component={NotFound} />
                    </Switch>
                  </div>
                </main>
            </Col>
          </Row>
        </Container>
      </div>
      <Backdrop open={props.isLoading} style={{ zIndex: 999999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
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
      setCurrencies: bindActionCreators(
        currencyActions.setCurrencies,
        dispatch
      ),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
