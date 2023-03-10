import React, { useState } from "react";
import {
  Grid,
  FormGroup,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import appConfig from "../../config/appConfig";
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

export default function GeneralTransactionReport() {
  const [transactions, setTransactions] = useState([]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
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
                  customer: customerInitialState,
                }}
                validateOnChange={false}
                validate={(values) => {
                  const errors = {} as any;

                  return errors;
                }}
                onSubmit={(values, actions) => {
                  actions.setValues(values);
                  axios
                    .post(
                      appConfig.baseApiUrl +
                        "report/GetGeneralTransactionHistory",
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
        <Grid item md={12} xs={12}>
          <MaterialTable
            title="Genel ????lem Listesi"
            columns={[
              { title: "Id", field: "transactionId" },
              { title: "????lem Tipi", field: "transactionType" },
              { title: "Tutar", field: "transactionAmount" },
              { title: "Tarih", field: "transactionDate",type:"date"},
              { title: "Olu??turma Tarihi", field: "creationDate",type:"datetime" , defaultSort:"asc"},
              { title: "Al????", field: "buyingRate" },
              { title: "Sat????", field: "sellingRate" },
              { title: "M????teri", field: "customerName" },
              { title: "Hesap", field: "accountNo" },
              { title: "D??viz", field: "currencyCode" },
              { title: "Hesap Bakiye", field: "accountBalance" },
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
              pageSize: 50,
              pageSizeOptions: [50, 100, 200],
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
