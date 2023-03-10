import React, { useState, useEffect } from "react";
import {
  Grid,
  FormGroup,
  TextField,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import appConfig from "../../config/appConfig";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { customerInitialState } from "../../interfaces/ICustomer";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import alertify from "alertifyjs";
import { Formik, Field } from "formik";
import MaterialTable from "material-table";
import { DownloadExcel } from "../../services/ExcelService";

export default function CustomerTransactionReport() {
  const [customers, setCustomers] = useState([customerInitialState]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get(appConfig.baseApiUrl + "customer/GetAllCustomers")
      .then((resJson) => {
        setCustomers(resJson.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item lg={3} md={12} xs={12}>
          <ExpansionPanel square defaultExpanded={true}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Filtreler</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Formik
                initialValues={{
                  startDate: new Date(),
                  endDate: new Date(),
                  customer: customers[0],
                }}
                validateOnChange={false}
                validate={(values) => {
                  const errors = {} as any;
                  if (values.customer.id < 1) {
                    errors.customer = "M????teri se??imi yap??lmal??d??r.";
                  }
                  return errors;
                }}
                onSubmit={(values, actions) => {
                  actions.setValues(values);
                  axios
                    .post(
                      appConfig.baseApiUrl +
                        "report/GetCustomerTransactionHistory",
                      values
                    )
                    .then((resJson) => {
                      setTransactions(resJson.data);
                      alertify.success("Liste G??ncellendi!");
                    });
                }}
              >
                {(formProps) => (
                  <form onSubmit={formProps.handleSubmit}>
                    <FormGroup>
                      <Field name={"startDate"} id={"startDate"}>
                        {({ field: { value }, form: { setFieldValue } }) => (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              margin="normal"
                              id="date-picker-dialog"
                              name="startDate"
                              label="????lem Tarihi"
                              format="dd/MM/yyyy"
                              value={value}
                              onChange={(val) => {
                                setFieldValue("startDate", val);
                              }}
                              okLabel="Se??"
                              cancelLabel="??ptal"
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        )}
                      </Field>
                      <Field name={"endDate"} id={"endDate"}>
                        {({ field: { value }, form: { setFieldValue } }) => (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              margin="normal"
                              id="date-picker-dialog"
                              name="endDate"
                              label="????lem Tarihi"
                              format="dd/MM/yyyy"
                              value={value}
                              onChange={(val) => {
                                setFieldValue("endDate", val);
                              }}
                              okLabel="Se??"
                              cancelLabel="??ptal"
                              KeyboardButtonProps={{
                                "aria-label": "change date",
                              }}
                            />
                          </MuiPickersUtilsProvider>
                        )}
                      </Field>
                      <Field name={"customer"} id={"customer"}>
                        {({ field: { value }, form: { setFieldValue } }) => (
                          <Autocomplete
                            id="customer"
                            options={customers}
                            getOptionLabel={(option) => option.customerName}
                            // defaultValue={customers[0]}
                            onChange={(event, value, target) => {
                              setFieldValue("customer", value);
                            }}
                            value={value}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label="M????teri"
                                placeholder="Se??ili M????teri"
                              />
                            )}
                          />
                        )}
                      </Field>
                      {formProps.errors.customer &&
                      formProps.touched.customer ? (
                        <div style={{ color: "red" }}>
                          {formProps.errors.customer}
                        </div>
                      ) : null}
                      <Button color="primary" type="submit">
                        G??ster
                      </Button>
                    </FormGroup>
                  </form>
                )}
              </Formik>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item lg={9} md={12} xs={12}>
          <MaterialTable
            title="Genel ????lem Listesi"
            columns={[
              { title: "Id", field: "transactionId" },
              { title: "????lem Tipi", field: "transactionType" },
              { title: "Tutar", field: "transactionAmount" },
              { title: "Tarih", field: "transactionDate", type: "date" },
              { title: "Al????", field: "buyingRate" },
              { title: "Sat????", field: "sellingRate" },
              { title: "Hesap", field: "accountNo", defaultGroupOrder: 0 },
              { title: "D??viz", field: "currencyCode" },
              { title: "Hesap Bakiye", field: "accountBalance" },
              { title: "A????klama", field: "transactionDescription" },
              {
                title: "????lemden ??nceki Bakiye",
                field: "balanceBeforeTransaction",
              },
              { title: "??lk Bakiye", field: "firstBalance" },
              { title: "Son Bakiye", field: "lastBalance" },
            ]}
            data={transactions}
            options={{
              grouping: true,
              actionsColumnIndex: -1,
              exportButton: true,
              exportCsv: (columns, data) => {
                DownloadExcel("M????teri Listesi", columns, data);
              },
              pageSize: 10,
              pageSizeOptions: [10, 50, 100],
            }}
            localization={{
              pagination: {
                labelDisplayedRows: "{from}-{to} of {count}",
              },
              header: {
                actions: "????lemler",
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
