import React from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import * as sideNavActions from "../store/actions/sideNavActions";
import { bindActionCreators } from "redux";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import appConfig from "../config/appConfig";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    float: "right",
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor: "#3f51b5"
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  title: {
    flexGrow: 1
  }
}));

function SideNav(props) {
  const getIcons = item => {
    if (item.icon)
      return (
        <ListItemIcon>
          <item.icon />
        </ListItemIcon>
      );
  };

  const classes = useStyles();
  const theme = useTheme();
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={props.sideNavIsOpen}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => props.actions.closeSideNav()}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>
        {appConfig.screenList.map((item, index) => {
          if (item.isVisible === true && (item.onlyAdmin === false || props.userContext.isAdmin===true) 
          && ((item.hasBalance && !props.userContext.cantSeeBalance) || !item.hasBalance) )
            return (
              <ListItem
                component={Link}
                tag={Link}
                onClick={() => props.actions.closeSideNav()}
                // to={"/" + item.link}
                to={item.link}
                button
                key={index}
              >
                {getIcons(item)}
                <ListItemText primary={item.displayName} />
              </ListItem>
            );
          else return "";
        })}
      </List>
    </Drawer>
  );
}

function mapStateToProps(state) {
  return {
    userContext: state.loginReducer,
    sideNavIsOpen: state.sideNavReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      openSideNav: bindActionCreators(sideNavActions.openSideNav, dispatch),
      closeSideNav: bindActionCreators(sideNavActions.closeSideNav, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
