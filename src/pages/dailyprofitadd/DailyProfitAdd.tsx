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
  baseFormReducer,
  baseCallBack,
} from "../../store/reducers/baseFormReducer";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { connect } from "react-redux";
import axios from "axios";
import MaterialTable from "material-table";
import alertify from "alertifyjs";

function DailyProfitAdd(props) {
  let history = useHistory();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [customers, setCustomers] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [state, updateState] = React.useReducer(baseFormReducer, {
    formState: {
      buyingRate: 0,
      sellingRate: 0,
      selectedCurrencies: [],
      selectedCustomer: [],
      transactionDate: new Date(),
    },
  });
  const [maxDate, setMaxDate] = useState(new Date());
  useEffect(() => {
    getMaxDate();
  }, []);

  const getMaxDate = ()=> {
    axios
      .get(appConfig.baseApiUrl + "transaction/GetMaxTransactionDate")
      .then((resJson) => {
        setMaxDate(new Date(resJson.data));
      });
  }

  const updateForm = React.useCallback(({ target: { value, name, type } }) => {
    baseCallBack({ value, name, type }, updateState);
  }, []);

  useEffect(() => {
    axios
      .get(appConfig.baseApiUrl + "customer/GetAllCustomers")
      .then((resJson) => {
        setCustomers(resJson.data);
        baseCallBack(
          {
            value: resJson.data,
            name: "formState.selectedCustomer",
            type: "datePicker",
          },
          updateState
        );
      });
  }, []);

  useEffect(() => {
    baseCallBack(
      {
        value: props.currencies,
        name: "formState.selectedCurrencies",
        type: "datePicker",
      },
      updateState
    );
  }, [props.currencies]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    baseCallBack(
      { value: date, name: "formState.transactionDate", type: "datePicker" },
      updateState
    );
  };
  const validateForm = (): Boolean => {
    var result = true;
    if (state.formState.buyingRate < 1 || state.formState.sellingRate < 1)
      result = false;
    if (maxDate > state.formState.transactionDate) {
      result = false;
      alertify.warning("Seçilen tarih son işlem tarihinden küçük olamaz");
    }
    if (!result) alertify.error("Alanları kontrol ediniz");

    return result;
  };
  const save = () => {
    if (validateForm())
      axios
        .post(
          appConfig.baseApiUrl + "transaction/AddBulkTransaction",
          state.formState
        )
        .then((resJson) => {
          alertify.success("İşlem Başarılı");
          setMonthlyTransactions(resJson.data);
          getMaxDate();
        });
  };

  const cancel = () => {
    history.push("/home");
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={3} xs={12}>
        <FormGroup>
          <TextField
            type="number"
            name="formState.buyingRate"
            value={state.formState.buyingRate}
            label="Alış Kuru"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="number"
            name="formState.sellingRate"
            value={state.formState.sellingRate}
            label="Satış Kuru"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              name="formState.transactionDate"
              label="İşlem Tarihi"
              format="dd/MM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              okLabel="Seç"
              cancelLabel="İptal"
              minDate={maxDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          <Autocomplete
            multiple
            id="formState.selectedCurrencies"
            disableCloseOnSelect={true}
            options={props.currencies}
            limitTags={2}
            renderOption={(option, { selected }) => (
              <React.Fragment>
                <Checkbox
                  // icon={icon}
                  // checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.currencyCode}
              </React.Fragment>
            )}
            getOptionLabel={(option) => option.currencyCode}
            defaultValue={state.formState.selectedCurrencies}
            onChange={(event, value, target) =>
              updateForm({
                target: {
                  value: value,
                  name: "formState.selectedCurrencies",
                  type: "Autocomplete",
                },
              })
            }
            value={state.formState.selectedCurrencies}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Döviz Cinsi"
                placeholder="Döviz Cinsi"
              />
            )}
          />
          <Autocomplete
            multiple
            disableCloseOnSelect={true}
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
            defaultValue={state.selectedCustomer}
            onChange={(event, value, target) =>
              updateForm({
                target: {
                  value: value,
                  name: "formState.selectedCustomer",
                  type: "Autocomplete",
                },
              })
            }
            value={state.formState.selectedCustomer}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Müşteri"
                placeholder="Seçili Müşteri"
              />
            )}
          />
          <Grid container>
            <Grid item xs={6}>
              <Button color="primary" onClick={() => save()}>
                Kaydet
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button color="secondary" onClick={() => cancel()}>
                İptal
              </Button>
            </Grid>
          </Grid>
        </FormGroup>
      </Grid>
      <Grid item md={9} xs={12}>
        <MaterialTable
          title="Müşteri Listesi"
          columns={[
            { title: "Tarih", field: "transactionDate", type: "date" },
            { title: "Alış Oranı", field: "buyingRate" },
            { title: "Satış Oranı", field: "sellingRate" },
          ]}
          data={monthlyTransactions}
          options={{
            actionsColumnIndex: -1,
            exportButton: true,
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
              exportTitle: "Dosyaya çıkar",
              searchTooltip: "Ara",
              searchPlaceholder: "Aranacak kelimeyi giriniz",
            },
          }}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(DailyProfitAdd);
