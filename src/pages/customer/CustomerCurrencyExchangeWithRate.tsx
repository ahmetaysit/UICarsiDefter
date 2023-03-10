import React, { useState, useEffect } from "react";
import {
  baseFormReducer,
  baseCallBack,
} from "../../store/reducers/baseFormReducer";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useHistory } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import {
  Grid,
  FormGroup,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import axios from "axios";
import alertify from "alertifyjs";
import appConfig from "../../config/appConfig";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

function CustomerCurrencyExchange(props) {
  let history = useHistory();
  const initialFOrmState = {
    customerId: props.customer.id,
    transactionDate: new Date(),
    transactionType: 4,
    amount: 0,
    currency:1,
    currencyBuyingRate: 1,
    currencySellingRate: 1,
    fromAccountId: 0,
    toAccountId: 0,
    description:""
  };
  const [state, updateState] = React.useReducer(baseFormReducer, {
    formState: initialFOrmState,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [maxDate, setMaxDate] = useState(new Date());

  useEffect(() => {
    baseCallBack(
      { value: props.customer.id, name: "formState.customerId", type: "number" },
      updateState
    );
    axios
      .get(appConfig.baseApiUrl + "transaction/GetMaxTransactionDate")
      .then((resJson) => {
        setMaxDate(new Date(resJson.data));
      });
  }, [props.customer]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    baseCallBack(
      { value: date, name: "formState.transactionDate", type: "datePicker" },
      updateState
    );
  };
  const updateForm = React.useCallback(({ target: { value, name, type } }) => {
    baseCallBack({ value, name, type }, updateState);
  }, []);
  const setAllBalance = () => {
    var acc = props.customerAccounts.find(
      (x) => x.id === state.formState.fromAccountId
    );

    baseCallBack(
      { value: acc.accountBalance, name: "formState.amount", type: "number" },
      updateState
    );
  };
  const changeTransactionType = () => {
    baseCallBack(
      { value: 0, name: "formState.fromAccountId", type: "number" },
      updateState
    );
    baseCallBack(
      { value: 0, name: "formState.toAccountId", type: "number" },
      updateState
    );
  };

  const validate = () => {
    let result = true;
    if (
      state.formState.amount === 0 ||
      (state.formState.transactionType === 1 &&
        state.formState.toAccountId === 0) ||
      (state.formState.transactionType === 2 &&
        state.formState.fromAccountId === 0) ||
      (state.formState.transactionType === 3 &&
        (state.formState.fromAccountId === 0 ||
          state.formState.toAccountId === 0))
    ) {
      result = false;
    }
    if ((maxDate > state.formState.transactionDate)) {
      alertify.warning("Se??ilen tarih son i??lem tarihinden k??????k olamaz");
      result = false;
    }
    return result;
  };
  const saveTransaction = () => {
    if (validate()) {
      axios
        .post(
          appConfig.baseApiUrl + "customer/ExchangeTransferWithRate",
          state.formState
        )
        .then((resJson) => {
          alertify.success("Ok");
          history.push("/customerListShort");
        });
    } else {
      alertify.error("Alanlar?? Kontrol Ediniz!");
    }
  };
  const tranTypes = [
    { id: 4, value: "KurluGiris" },
    { id: 5, value: "KurluCikis" },
  ];
  return (
    <div>
      {/* TODO:validasyon Yap??lacak */}
      <Grid container>
        <FormGroup>
          <InputLabel id="transactionType-label" shrink={true}>
            ????lem Tipi
          </InputLabel>
          <Select
            type="select"
            labelId="transactionType-label"
            name="formState.transactionType"
            value={state.formState.transactionType || 0}
            onChange={(target) => {
              updateForm(target);
              changeTransactionType();
            }}
          >
            {tranTypes.map((item, i) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.value}
                </MenuItem>
              );
            })}
          </Select>
          <TextField
            type="number"
            name="formState.amount"
            value={state.formState.amount}
            label="Tutar"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <InputLabel id="currency-label" shrink={true}>
            D??viz
          </InputLabel>
          <Select
            type="select"
            labelId="currency-label"
            name="formState.currency"
            value={state.formState.currency || 1}
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
          <TextField
            disabled={state.formState.transactionType === 1 || state.formState.transactionType === 2}
            type="number"
            name="formState.currencyBuyingRate"
            value={state.formState.currencyBuyingRate}
            label="D??viz/Alt??n Al????"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            disabled={state.formState.transactionType === 1 || state.formState.transactionType === 2}
            type="number"
            name="formState.currencySellingRate"
            value={state.formState.currencySellingRate}
            label="D??viz/Alt??n Sat???? Parite"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <InputLabel id="toAccountId-label" shrink={true}>
            Giri?? Hesab??
          </InputLabel>
          <Select
            disabled={state.formState.transactionType === 5}
            type="select"
            labelId="toAccountId-label"
            name="formState.toAccountId"
            value={state.formState.toAccountId || 0}
            onChange={updateForm}
          >
            <MenuItem key={0} value={0}>
              Hi??biri
            </MenuItem>
            {props.customerAccounts.map((item, i) => {
              return (
                <MenuItem key={i} value={item.id}>
                  {item.accountNo} - {props.userContext.cantSeeBalance ? "***" : item.calculatedLastAccountBalance}
                </MenuItem>
              );
            })}
          </Select>
          <div style={{ flexDirection: "row" }}>
            <InputLabel id="fromAccountId-label" shrink={true}>
              ????k???? Hesab??
            </InputLabel>
            <Select
              disabled={state.formState.transactionType === 4}
              type="select"
              labelId="fromAccountId-label"
              name="formState.fromAccountId"
              value={state.formState.fromAccountId || 0}
              onChange={updateForm}
              style={{ width: 270 }}
            >
              <MenuItem key={0} value={0}>
                Hi??biri
              </MenuItem>
              {props.customerAccounts.map((item, i) => {
                return (
                  <MenuItem key={i} value={item.id}>
                    {item.accountNo} - {props.userContext.cantSeeBalance ? "***" : item.calculatedLastAccountBalance}
                  </MenuItem>
                );
              })}
            </Select>
            {/* <Button
              disabled={state.formState.fromAccountId === 0}
              style={{ position: "absolute", right: "-55" }}
              onClick={() => setAllBalance()}
            >
              Tamam??
            </Button> */}
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              name="formState.transactionDate"
              label="Date picker dialog"
              format="dd/MM/yyyy"
              minDate={maxDate}
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          <TextField
            type="text"
            name="formState.description"
            multiline
            rows={3}
            value={state.formState.description}
            label="A????klama"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />

          <div style={{ flexDirection: "row" }}>
            <Button onClick={() => saveTransaction()} color="primary">
              Kaydet
            </Button>
            <Button onClick={() => alert("cancel")} color="secondary">
              ??ptal
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
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerCurrencyExchange);
