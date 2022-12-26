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
import { saveAs } from "file-saver";
import XLSX from "xlsx";
import {
  strToArrBuffer,
} from "../../utils/DataUtils"

export default function SmsExcelList() {
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
                        "excell/GenerateEndOfMonthExcel",
                      values
                    )
                    .then((resJson) => {
                      var fileName = "SmsList_" + new Date().getTime().toString() + ".xlsx"
                      var binary_string = window.atob(resJson.data);
                      var len = binary_string.length;
                      var bytes = new Uint8Array(len);
                      for (var i = 0; i < len; i++) {
                          bytes[i] = binary_string.charCodeAt(i);
                      }
                      console.log(bytes);
                      saveAs(
                        new Blob([bytes], {
                          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        }),
                        fileName
                      );
                      // setTransactions(resJson.data);
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
      </Grid>
    </div>
  );
}
