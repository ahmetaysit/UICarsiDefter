import React, { useState, useEffect } from "react";
import {
  Grid,
  FormGroup,
  TextField,
  Checkbox,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import appConfig from "../../config/appConfig";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import alertify from "alertifyjs";
import { Formik } from "formik";
import { connect } from "react-redux";

function EndOfMonthTransaction(props) {
  const [customers, setCustomers] = useState([]);
  let history = useHistory();
  useEffect(() => {
    axios
      .get(appConfig.baseApiUrl + "customer/GetAllCustomers")
      .then((resJson) => {
        setCustomers(resJson.data);
        changeInitialState("selectedCustomer", resJson.data);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeInitialState = (name, value) => {
    var tmpState = { ...initialState };
    tmpState[name] = value;
    setInitialState(tmpState);
  };
  const [initialState, setInitialState] = useState({
    selectedDate: new Date(),
    selectedCustomer: [] as any,
  });
  return (
    <Grid container spacing={2}>
      <Grid item md={3} sm={6} xs={12}>
        <Formik
          initialValues={{
            selectedDate: initialState.selectedDate,
            selectedCustomer: initialState.selectedCustomer,
          }}
          enableReinitialize
          onSubmit={(values, actions) => {
            axios
              .post(
                appConfig.baseApiUrl + "customer/MakeMonthEndProcess",
                values
              )
              .then((resJson) => {
                alertify.success("Başarılı bir şekilde eklenmiştir.");
                history.push("/home")
              });
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <FormGroup>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    name="selectedDate"
                    label="İşlem Tarihi"
                    format="dd/MM/yyyy"
                    value={props.initialValues.selectedDate}
                    onChange={(val) => {
                      changeInitialState("selectedDate", val);
                    }}
                    okLabel="Seç"
                    cancelLabel="İptal"
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
                <Autocomplete
                  multiple
                  id="formState.selectedCustomers"
                  options={customers}
                  limitTags={2}
                  renderOption={(option, { selected }) => (
                    <React.Fragment>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} />
                      {option.customerName}
                    </React.Fragment>
                  )}
                  getOptionLabel={(option) => option.customerName}
                  defaultValue={props.initialValues.selectedCustomer}
                  onChange={(event, value, target) => {
                    changeInitialState("selectedCustomer", value);
                  }}
                  value={props.initialValues.selectedCustomer}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Müşteri"
                      placeholder="Seçili Müşteri"
                    />
                  )}
                />
                <Button color="primary" type="submit">
                  Hesap Kesimi Yap
                </Button>
              </FormGroup>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state) {
    return {
      currencies: state.currencyReducer,
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: {},
    };
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(EndOfMonthTransaction);