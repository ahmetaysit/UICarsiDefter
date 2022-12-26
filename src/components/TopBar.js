import React from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import * as Icons from "@material-ui/icons";
import { connect } from "react-redux";
import * as sideNavActions from "../store/actions/sideNavActions";
import { bindActionCreators } from "redux";
import { makeStyles } from "@material-ui/core/styles";
import * as loginActions from "../store/actions/loginActions";
import { Grid, Badge } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import appConfig from "../config/appConfig";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    position: "relative",
    display: "inline",
    // marginRight: theme.spacing(2)
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    // display: "flex",
    // alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    // justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  title: {
    // flexGrow: 1
  },
}));

function TopBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();
  const logOut = () => {
    props.actions.logout();
  };
  const sideNavOpen = () => {
    props.actions.openSideNav();
  };
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.sideNavIsOpen,
      })}
    >
      <Toolbar>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => sideNavOpen()}
                  edge="start"
                  className={clsx(
                    classes.menuButton,
                    props.sideNavIsOpen && classes.hide
                  )}
                >
                  <Icons.Menu />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h6" noWrap>
                  {appConfig.projectName}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="h6" noWrap>
                Hoşgeldin {props.usercontext.nameSurname}
              </Typography>
              {/* <IconButton>
                <Badge badgeContent={4} color="secondary">
                  <Icons.NotificationsNone />
                </Badge>
              </IconButton> */}
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Icons.AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  {appConfig.topBarRightButtons.map((item, index) => (
                    <MenuItem
                      to={"/" + item.link}
                      key={index}
                      component={Link}
                      onClick={() => handleClose()}
                    >
                      {item.displayName}
                    </MenuItem>
                  ))}
                  <MenuItem
                    // to="/login"
                    onClick={() => logOut()}
                    color="inherit"
                  >
                    Çıkış
                  </MenuItem>
                </Menu>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

function mapStateToProps(state) {
  return {
    sideNavIsOpen: state.sideNavReducer,
    usercontext: state.loginReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      openSideNav: bindActionCreators(sideNavActions.openSideNav, dispatch),
      closeSideNav: bindActionCreators(sideNavActions.closeSideNav, dispatch),
      login: bindActionCreators(loginActions.login, dispatch),
      setLoginContext: bindActionCreators(
        loginActions.setLoginContext,
        dispatch
      ),
      logout: bindActionCreators(loginActions.logout, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
