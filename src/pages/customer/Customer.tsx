import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Divider, AppBar, Tabs, Tab, Box } from "@material-ui/core";
import CustomerAdd from "./CustomerAdd";
import { customerInitialState } from "../../interfaces/ICustomer";
import CustomerAccountList from "./CustomerAccountList";
import appConfig from "../../config/appConfig";
import axios from "axios";
import CustomerCurrencyExchange from "./CustomerCurrencyExchange";
import CustomerCurrencyExchangeSimulation from "./CustomerCurrencyExchangeSimulation";
import { connect } from "react-redux";
import CustomerCurrencyExchangeWithRate from "./CustomerCurrencyExchangeWithRate";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Customer(props) {
  const [customer, setCustomer] = React.useState(customerInitialState);
  const [customerAccounts, setAccounts] = React.useState([{}]);
  const [groups, setGroups] = React.useState([{}]);
  const [value, setValue] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.customer !== "")
        setCustomer(props.location.state.customer);
      setGroups(props.location.state.customerGroups);
    }
  }, [props.location.state]);

  useEffect(() => {
    if (customer.id > 0) {
      axios
        .get(
          appConfig.baseApiUrl +
            "customer/GetCustomerAccounts?customerId=" +
            customer.id
        )
        .then((resJson) => {
          setAccounts(resJson.data);
        });
    }
  }, [customer, props.actions]);

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Genel" {...a11yProps(0)} />
          <Tab label="M????teri Hesaplar??" {...a11yProps(1)} 
          hidden = {props.userContext.cantSeeBalance}
          />
          <Tab
            label="D??viz Giri??/????k????/Transfer"
            {...a11yProps(2)}
            disabled={customer.id === 0}
            hidden={!props.userContext.isAdmin}
          />
          <Tab
            label="D??viz Giri??/????k????/Transfer Talebi"
            {...a11yProps(3)}
            disabled={customer.id === 0}
          />
          <Tab
            label="Kurlu Giri?? ????k????"
            {...a11yProps(3)}
            disabled={customer.id === 0}
          />
        </Tabs>
      </AppBar>
      <Divider />

      <TabPanel value={value} index={0}>
        <CustomerAdd customer={customer} groups={groups}></CustomerAdd>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CustomerAccountList
          customerAccounts={customerAccounts}
        ></CustomerAccountList>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CustomerCurrencyExchange
          customerAccounts={customerAccounts}
          customer={customer}
        ></CustomerCurrencyExchange>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CustomerCurrencyExchangeSimulation
          customerAccounts={customerAccounts}
          customer={customer}
        ></CustomerCurrencyExchangeSimulation>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <CustomerCurrencyExchangeWithRate
        customerAccounts={customerAccounts}
        customer={customer}>
        </CustomerCurrencyExchangeWithRate>
      </TabPanel>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userContext: state.loginReducer,
    isLoading: state.loadingReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Customer);
