import React, { useEffect, useState } from "react";
import {
  baseFormReducer,
  baseCallBack,
} from "../../store/reducers/baseFormReducer";
import DateFnsUtils from "@date-io/date-fns";

import {
  Grid,
  TextField,
  Button,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import axios from "axios";
import alertify from "alertifyjs";
import { customerInitialState } from "../../interfaces/ICustomer";
import { Redirect } from "react-router-dom";
import appConfig from "../../config/appConfig";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as sideNavActions from "../../store/actions/sideNavActions";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

interface IGroup {
  id: number;
  groupName: String;
  isActive: boolean;
}

function CustomerAddNewSummary(props) {
  const save = () => {
    let valid = true;
    if (!state.customer.amount) {
      alertify.error("Tutar giriniz");
      valid = false;
    }
    if (state.customer.customerName === "") {
      alertify.error("İsim giriniz");
      valid = false;
    }
    if (!state.customer.currency) {
      alertify.error("Döviz giriniz");
      valid = false;
    }

    if(!valid) return;
    alertify.confirm(
      "Confirm Message",
      function () {
        axios
          .post(appConfig.baseApiUrl + "customer/CreateCustomerWithBalance", state.customer)
          .then((data) => {
            alertify.success("Ok");
            updateisRedirect(true);
          });
      },
      function () {
        alertify.error("Cancel");
      }
    );
  };
  const [state, updateState] = React.useReducer(baseFormReducer, {
    customer: {
      id: 0,
      customerCode: "",
      customerName: "",
      defaultCurrencyId: 0,
      phoneNumber: 0,
      email: "",
      poolRate: 20,
      isActive: true,
      customerGroupId: 0,
      isJustForBalance: false,
      transactionDate: new Date()
    },
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isRedirect, updateisRedirect] = useState(false);
  const [groups, updateGroups] = useState([] as IGroup[]);
  const updateForm = React.useCallback(({ target: { value, name, type } }) => {
    baseCallBack({ value, name, type }, updateState);
  }, []);

  useEffect(() => {
    if (props.location.state) {
      console.log(props.currencies);
      updateGroups(props.location.state.customerGroups);
    }
  }, [props.location.state]);
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    baseCallBack(
      { value: date, name: "customer.transactionDate", type: "datePicker" },
      updateState
    );
  };
  if (isRedirect === true) {
    return <Redirect to="/customerlist" />;
  }
  return (
    <div>
      <Grid container>
        <FormGroup>
          <TextField
            required
            name="customer.customerName"
            value={state.customer.customerName}
            label="Müşteri Adı Soyadı"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />

          {/* <TextField
            type="number"
            name="customer.poolRate"
            value={state.customer.poolRate}
            label="Havuz Oranı"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          /> */}
          <TextField
            type="number"
            name="customer.amount"
            value={state.customer.amount}
            label="Giriş Tutarı"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <InputLabel id="currency-label" shrink={true}>
            Döviz
          </InputLabel>
          <Select
            type="select"
            labelId="currency-label"
            name="customer.currency"
            value={state.customer.currency}
            onChange={updateForm}
          >
            {props.currencies.map((item, i) => {
              return (
                <MenuItem key={i} value={item.id}>
                  {item.currencyCode}
                </MenuItem>
              );
            })}
          </Select>
          <InputLabel id="customerGroupId-label" shrink={true}>
            Müşteri Grubu
          </InputLabel>
          <Select
            type="select"
            labelId="customerGroupId-label"
            name="customer.customerGroupId"
            value={state.customer.customerGroupId}
            onChange={updateForm}
            // label="Müşteri Grubu"
          >
            <MenuItem value={0} key={0}>
              Hiçbiri
            </MenuItem>
            {groups.map((item, i) => {
              return (
                <MenuItem key={i} value={item.id}>
                  {item.groupName}
                </MenuItem>
              );
            })}
          </Select>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              name="customer.transactionDate"
              label="İşlem Tarihi"
              format="dd/MM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              okLabel="Seç"
              cancelLabel="İptal"
              // minDate={new Date()}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          <div style={{ flexDirection: "row" }}>
            <Button onClick={() => save()} color="primary">
              Kaydet
            </Button>
            <Button onClick={() => updateisRedirect(true)} color="secondary">
              İptal
            </Button>
          </div>
        </FormGroup>
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
      closeSideNav: bindActionCreators(sideNavActions.closeSideNav, dispatch),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerAddNewSummary);
