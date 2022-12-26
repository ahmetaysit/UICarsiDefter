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

export default function SmsRequestList() {
    const [smsRequests, setSmsRequests] = useState([])
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
                        "report/GetSmsRequests",
                      values
                    )
                    .then((resJson) => {
                      setSmsRequests(resJson.data);
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
        <Grid item md={12} xs={12}>
          <MaterialTable
            title="Sms Listesi"
            columns={[
              { title: "Id", field: "id" },
              { title: "Müşteri Adı", field: "customerName" },
              { title: "İşlem Tipi", field: "phoneNumber" },
              { title: "Tutar", field: "smsText" },
              { title: "Tarih", field: "creationDate", type: "date" },
            ]}
            data={smsRequests}
            options={{
              actionsColumnIndex: -1,
              exportButton: true,
              exportCsv: (columns, data) => {
                DownloadExcel("Sms Listesi", columns, data);
              },
              pageSize: 50,
              pageSizeOptions: [50, 100, 200],
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
                exportTitle: "Dosyaya Aktar",
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
