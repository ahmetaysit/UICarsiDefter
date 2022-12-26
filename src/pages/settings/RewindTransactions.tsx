import React, { useState } from "react";
import { Grid, FormGroup, Button } from "@material-ui/core";
import appConfig from "../../config/appConfig";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import alertify from "alertifyjs";
import { Formik } from "formik";
import { connect } from "react-redux";

function RewindTransactions(props) {
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
            startDate: initialState.selectedDate,
          }}
          enableReinitialize
          onSubmit={(values, actions) => {
            alertify.confirm(
              "Onay",
              "Seçilen tarihe geri dönülecek onaylıyor musunuz ?",
              function () {
                axios
                  .post(
                    appConfig.baseApiUrl + "settings/RewindTransactions",
                    values
                  )
                  .then((resJson) => {
                    alertify.success("Başarılı bir şekilde tarihe geri dönülmüştür.");
                  });
              },
              function () {
                alertify.error("İptal Edildi");
              }
            );
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
                    value={props.initialValues.startDate}
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
                <Button color="primary" type="submit">
                  Tarihe Geri Dön
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

export default connect(mapStateToProps, mapDispatchToProps)(RewindTransactions);
