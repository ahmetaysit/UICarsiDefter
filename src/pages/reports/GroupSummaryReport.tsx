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

export default function GroupSummaryReport() {
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
                }}
                validateOnChange={false}
                // validate={(values) => {
                //   const errors = {} as any;
                //   if (values.startDate < 1) {
                //     errors.customer = "Müşteri seçimi yapılmalıdır.";
                //   }
                //   return errors;
                // }}
                onSubmit={(values, actions) => {
                  actions.setValues(values);
                  axios
                    .post(
                      appConfig.baseApiUrl +
                        "report/GetGroupSummaryReport",
                      values
                    )
                    .then((resJson) => {
                      setTransactions(resJson.data);
                      alertify.success("Liste Güncellendi!");
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
                              label="İşlem Tarihi"
                              format="dd/MM/yyyy"
                              value={value}
                              onChange={(val) => {
                                setFieldValue("startDate", val);
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
                      <Field name={"endDate"} id={"endDate"}>
                        {({ field: { value }, form: { setFieldValue } }) => (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              margin="normal"
                              id="date-picker-dialog"
                              name="endDate"
                              label="İşlem Tarihi"
                              format="dd/MM/yyyy"
                              value={value}
                              onChange={(val) => {
                                setFieldValue("endDate", val);
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
                      <Button color="primary" type="submit">
                        Göster
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
            title="Genel İşlem Listesi"
            columns={[
              { title: "Grup Adı", field: "groupName",defaultGroupOrder: 0 },
              { title: "Döviz", field: "currencyCode" },
              { title: "Toplam Kar", field: "totalProfit" },
              { title: "Toplam Bakiye", field: "totalBalance",},
              { title: "Havuz Karı", field: "poolProfit" },
            ]}
            data={transactions}
            options={{
              grouping: true,
              actionsColumnIndex: -1,
              exportButton: true,
              exportCsv: (columns, data) => {
                DownloadExcel("Grup Özet Raporu", columns, data);
              },
              pageSize: 10,
              pageSizeOptions: [10, 50, 100],
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
