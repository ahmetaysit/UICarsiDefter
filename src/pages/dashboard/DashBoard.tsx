import { Button, Grid } from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { bindActionCreators } from "redux";
import appConfig from "../../config/appConfig";
import { ICustomerGroup } from "../../interfaces/ICustomerGroup";
import { connect } from "react-redux";
import * as sideNavActions from "../../store/actions/sideNavActions";


function DashBoard(props) {
  let history = useHistory();
  const openNewCustomer = () => {
    props.actions.closeSideNav();
    history.push({pathname:"/customerAddNewSummary",state:{ customerGroups }})
  };
  const goToCustomerListShort = () => {
    props.actions.closeSideNav();
    history.push({pathname:"/customerListShort",state:{ customerGroups }})
  };
  const goToLastFiftyTransaction = () => {
    props.actions.closeSideNav();
    history.push({pathname:"/lastFiftyTransaction",state:{ customerGroups }})
  };
  
  const [customerGroups, setCustomerGroups] = useState({});
  const [groups, setGroups] = useState({});

  useEffect(() => {
    if (Object.entries(groups).length === 0 && groups.constructor === Object)
      axios
        .get(appConfig.baseApiUrl + "customer/GetCustomerGroups")
        .then((resJson) => {
          setCustomerGroups(resJson.data);
          var obj = {};
          resJson.data.map((item: ICustomerGroup) => {
            return (obj[item.id] = item.groupName);
          });
          setGroups(obj);
        });
  }, [groups]);
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Button color="primary" onClick={() => openNewCustomer()} variant="contained" style={{ minWidth:"250px" }}>
            Yeni Müşteri Aç
          </Button>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button color="primary" onClick={() => goToCustomerListShort()} variant="contained" style={{ minWidth:"250px" }}>
            Kurlu Giriş/Çıkış
          </Button>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Button color="primary" onClick={() => goToLastFiftyTransaction()} variant="contained" style={{ minWidth:"250px" }}>
            Son 50 İşlem
          </Button>
        </Grid>
      </Grid>
      
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userContext: state.loginReducer,
    sideNavIsOpen: state.sideNavReducer,
    currencies: state.currencyReducer,
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

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);