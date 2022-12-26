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
import { Formik, Field } from "formik";
import { connect } from "react-redux";

function ShopProfitEntry(props) {
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
    totalAmount: 0,
    dayCount: 0,
    totalProfit: 0,
    selectedDate: new Date(),
    selectedCurrencies: props.currencies,
    selectedCustomer: [] as any,
  });
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={3} sm={6} xs={12}>
          <Formik
            initialValues={{
              totalAmount: 0,
              dayCount: 0,
              totalProfit: 0,
              selectedDate: initialState.selectedDate,
              selectedCurrencies: initialState.selectedCurrencies,
              selectedCustomers: initialState.selectedCustomer,
            }}
            validateOnChange={false}
            enableReinitialize
            validate={(values) => {
              const errors = {} as any;
              if (!values.dayCount || values.dayCount < 1) {
                errors.dayCount = "Required";
                alertify.error("Alanları Kontrol Ediniz!");
              } else if (!values.totalAmount || values.totalAmount < 1) {
                errors.dayCount = "Required";
                alertify.error("Alanları Kontrol Ediniz!");
              } else if (!values.totalProfit || values.totalProfit < 1) {
                errors.dayCount = "Required";
                alertify.error("Alanları Kontrol Ediniz!");
              }

              return errors;
            }}
            onSubmit={(values, actions) => {
              axios
                .post(
                  appConfig.baseApiUrl + "transaction/AddShopProfit",
                  values
                )
                .then((resJson) => {
                  alertify.success("İşlem Başarılı!");
                  history.push("/home");
                });
            }}
          >
            {(formProps) => (
              <form onSubmit={formProps.handleSubmit}>
                <FormGroup>
                  <TextField
                    type="number"
                    defaultValue={formProps.initialValues.totalAmount}
                    name="totalAmount"
                    label="Toplam Tutar"
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="number"
                    defaultValue={formProps.initialValues.dayCount}
                    name="dayCount"
                    label="Gün Sayısı"
                    onChange={formProps.handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    type="number"
                    defaultValue={formProps.initialValues.totalProfit}
                    name="totalProfit"
                    label="Kar Tutarı"
                    onChange={formProps.handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Field name={"selectedDate"} id={"selectedDate"}>
                    {({ field: { value }, form: { setFieldValue } }) => (
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          margin="normal"
                          id="date-picker-dialog"
                          name="selectedDate"
                          label="İşlem Tarihi"
                          format="dd/MM/yyyy"
                          value={value}
                          onChange={(val) => {
                            setFieldValue("selectedDate", val);
                          }}
                          okLabel="Seç"
                          cancelLabel="İptal"
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    )}
                  </Field>
                  <Field name={"selectedCurrencies"} id={"selectedCurrencies"}>
                    {({ field: { value }, form: { setFieldValue } }) => (
                      <Autocomplete
                        multiple
                        id="selectedCurrencies"
                        options={props.currencies}
                        limitTags={2}
                        renderOption={(option, { selected }) => (
                          <React.Fragment>
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.currencyCode}
                          </React.Fragment>
                        )}
                        getOptionLabel={(option) => option.currencyCode}
                        defaultValue={value}
                        onChange={(event, value, target) => {
                          setFieldValue("selectedCurrencies", value);
                        }}
                        value={value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Döviz Cinsi"
                            placeholder="Döviz Cinsi"
                          />
                        )}
                      />
                    )}
                  </Field>
                  <Field name={"selectedCustomers"} id={"selectedCustomers"}>
                    {({ field: { value }, form: { setFieldValue } }) => (
                      <Autocomplete
                        multiple
                        id="selectedCustomers"
                        options={customers}
                        limitTags={2}
                        renderOption={(option, { selected }) => (
                          <React.Fragment>
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.customerName}
                          </React.Fragment>
                        )}
                        getOptionLabel={(option) => option.customerName}
                        defaultValue={value}
                        onChange={(event, value, target) => {
                          setFieldValue("selectedCustomers", value);
                        }}
                        value={value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Müşteri"
                            placeholder="Seçili Müşteri"
                          />
                        )}
                      />
                    )}
                  </Field>
                  <Button color="primary" type="submit">
                    Kaydet
                  </Button>
                </FormGroup>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopProfitEntry);
