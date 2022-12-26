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
    transactionType: 1,
    amount: 0,
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
    axios
      .get(appConfig.baseApiUrl + "transaction/GetMaxTransactionDate")
      .then((resJson) => {
        setMaxDate(new Date(resJson.data));
      });
  }, []);

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
      alertify.warning("Seçilen tarih son işlem tarihinden küçük olamaz");
      result = false;
    }
    return result;
  };
  const saveTransaction = () => {
    if (validate()) {
      axios
        .post(
          appConfig.baseApiUrl + "customer/ExchangeTransfer",
          state.formState
        )
        .then((resJson) => {
          alertify.success("Ok");
          history.push("/customerlist");
        });
    } else {
      alertify.error("Alanları Kontrol Ediniz!");
    }
  };
  const tranTypes = [
    { id: 1, value: "Giriş" },
    { id: 2, value: "Çıkış" },
    { id: 3, value: "Transfer" },
  ];
  return (
    <div>
      {/* TODO:validasyon Yapılacak */}
      <Grid container>
        <FormGroup>
          <InputLabel id="transactionType-label" shrink={true}>
            İşlem Tipi
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
          <TextField
            disabled={state.formState.transactionType === 1 || state.formState.transactionType === 2}
            type="number"
            name="formState.currencyBuyingRate"
            value={state.formState.currencyBuyingRate}
            label="Döviz/Altın Alış"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            disabled={state.formState.transactionType === 1 || state.formState.transactionType === 2}
            type="number"
            name="formState.currencySellingRate"
            value={state.formState.currencySellingRate}
            label="Döviz/Altın Satış Parite"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <div style={{ flexDirection: "row" }}>
            <InputLabel id="fromAccountId-label" shrink={true}>
              Çıkış Hesabı
            </InputLabel>
            <Select
              disabled={state.formState.transactionType === 1}
              type="select"
              labelId="fromAccountId-label"
              name="formState.fromAccountId"
              value={state.formState.fromAccountId || 0}
              onChange={updateForm}
              style={{ width: 270 }}
            >
              <MenuItem key={0} value={0}>
                Hiçbiri
              </MenuItem>
              {props.customerAccounts.map((item, i) => {
                return (
                  <MenuItem key={i} value={item.id}>
                    {item.accountNo} - {item.accountBalance}
                  </MenuItem>
                );
              })}
            </Select>
            <Button
              disabled={state.formState.fromAccountId === 0}
              style={{ position: "absolute", right: "-55" }}
              onClick={() => setAllBalance()}
            >
              Tamamı
            </Button>
          </div>
          <InputLabel id="toAccountId-label" shrink={true}>
            Giriş Hesabı
          </InputLabel>
          <Select
            disabled={state.formState.transactionType === 2}
            type="select"
            labelId="toAccountId-label"
            name="formState.toAccountId"
            value={state.formState.toAccountId || 0}
            onChange={updateForm}
          >
            <MenuItem key={0} value={0}>
              Hiçbiri
            </MenuItem>
            {props.customerAccounts.map((item, i) => {
              return (
                <MenuItem key={i} value={item.id}>
                  {item.accountNo} - {item.accountBalance}
                </MenuItem>
              );
            })}
          </Select>
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
            label="Açıklama"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />

          <div style={{ flexDirection: "row" }}>
            <Button onClick={() => saveTransaction()} color="primary">
              Kaydet
            </Button>
            <Button onClick={() => alert("cancel")} color="secondary">
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
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerCurrencyExchange);
