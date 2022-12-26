import React, { useState, useEffect } from "react";
import {
  baseFormReducer,
  baseCallBack,
} from "../../store/reducers/baseFormReducer";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
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
import { connect } from "react-redux";
import MaterialTable from "material-table";

function CustomerCurrencyExchangeSimulation(props) {
  const initialFOrmState = {
    customerId: props.customer.id,
    transactionDate: new Date(),
    transactionType: 1,
    amount: 0,
    buyingRate: 1,
    sellingRate: 1,
    fromAccountId: 0,
    toAccountId: 0,
    toAccBalanceAfter: 0,
    fromAccBalanceAfter: 0,
    createdBy: props.userContext.id,
    createdDate: new Date(),
    updatedDate: new Date(),
    status: 1,
    description:""
  };
  const [state, updateState] = React.useReducer(baseFormReducer, {
    formState: initialFOrmState,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [tranRequests, setRequests] = useState([]);
  const [maxDate, setMaxDate] = useState(new Date());

  useEffect(() => {
    axios
      .get(appConfig.baseApiUrl + "transaction/GetMaxTransactionDate")
      .then((resJson) => {
        setMaxDate(new Date(resJson.data));
      });
  }, []);

  const getRequests = () => {
    axios
      .get(
        appConfig.baseApiUrl +
          "transaction/GetTransactionRequests?customerId=" +
          props.customer.id
      )
      .then((resJson) => {
        setRequests(resJson.data);
      });
  };
  useEffect(() => {
    getRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {
        value: acc.calculatedLastAccountBalance,
        name: "formState.amount",
        type: "number",
      },
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

    if (maxDate > state.formState.transactionDate) {
      alertify.warning("Seçilen tarih son işlem tarihinden küçük olamaz");
      result = false;
    }

    return result;
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

  const saveTransaction = () => {
    if (validate()) {
      axios
        .post(
          appConfig.baseApiUrl + "transaction/AddTransactionRequest",
          state.formState
        )
        .then((resJson) => {
          alertify.success("Ok");
          getRequests();
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
        <Grid item md={3} xs={12}>
          <FormGroup style={{ maxWidth: 250 }}>
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
              disabled={state.formState.transactionType !== 3}
              type="number"
              name="formState.buyingRate"
              value={state.formState.buyingRate}
              label="Döviz/Altın Alış"
              onChange={updateForm}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              disabled={state.formState.transactionType !== 3}
              type="number"
              name="formState.sellingRate"
              value={state.formState.sellingRate}
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
                      {item.accountNo} - {props.userContext.cantSeeBalance ? "***" : item.calculatedLastAccountBalance}
                    </MenuItem>
                  );
                })}
              </Select>
              <Button
                disabled={state.formState.fromAccountId === 0}
                style={{ position: "absolute", right: "-70" }}
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
                    {item.accountNo} - {props.userContext.cantSeeBalance ? "***" : item.calculatedLastAccountBalance}
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
        <Grid item md={9} xs={12}>
          <MaterialTable
            style={{ marginLeft: 55 }}
            title="Bekleyen İşlemler"
            columns={[
              { title: "İşlem Tipi", field: "tranSactionType" },
              { title: "Müşteri Adı", field: "customerName" },
              { title: "Tutar", field: "amount" },
              { title: "Çıkış Hesabı", field: "fromAccount" },
              {
                title: "işlemden sonraki Bakiyesi",
                field: "fromAccBalanceAfter",
              },
              { title: "Alış Kuru", field: "buyingRate" },
              { title: "Satış Kuru", field: "sellingRate" },
              {
                title: "işlem Tarihi",
                field: "transactionDate",
                type: "date",
              },
            ]}
            data={tranRequests}
            options={{
              actionsColumnIndex: -1,
            }}
            localization={{
              pagination: {
                labelDisplayedRows: "{from}-{to} of {count}",
              },
              header: {
                actions: "İşlemler",
              },
              body: {
                emptyDataSourceMessage: "No records to display",
                filterRow: {
                  filterTooltip: "Filter",
                },
              },
              toolbar: {
                // showColumnsTitle?: string;
                // showColumnsAriaLabel?: string;
                exportTitle: "Dosyaya Aktar",
                // exportAriaLabel?: string;
                exportName: "Excel'e Aktar",
                searchTooltip: "Ara",
                searchPlaceholder: "Aranacak kelimeyi giriniz",
              },
            }}
          />
        </Grid>
      </Grid>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerCurrencyExchangeSimulation);
