import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import configureStore from "./store/reducers/cofigureStore";
import {
  MuiThemeProvider,
  createMuiTheme,
  responsiveFontSizes,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline"
import "alertifyjs/build/css/alertify.min.css";
import { HashRouter } from "react-router-dom";
// import { BrowserRouter } from "react-router-dom";

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      background:{default:"#fafafa",paper:"#fafafa"},
      primary: {
        main: "#26a69a",
      },
      secondary: {
        main: "#9A0036",
      },
    },
  })
);

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <HashRouter>
        <App />
      </HashRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
