import React, { useState, useEffect } from "react";
import {
  Grid,
  FormGroup,
  TextField,
  Checkbox,
  Button,
  FormControlLabel,
} from "@material-ui/core";
import { Formik } from "formik";
import MaterialTable from "material-table";
import alertify from "alertifyjs";
import axios from "axios";
import appConfig from "../../config/appConfig";
import { DownloadExcel } from "../../services/ExcelService";

export default function EmailSendingList() {
  const [groups, setGroups] = useState([]);
  const initialSetting = {
    id: 0,
    settingKey: "ToEmail",
    settingvalue: "",
    isActive: true,
  };
  const [selectedSetting, setSelectedSetting] = useState(initialSetting);

  useEffect(() => {
    axios
      .get(appConfig.baseApiUrl + "settings/GetMailSettings")
      .then((resJson) => {
        console.log(resJson);
        setGroups(resJson.data);
      });
  }, []);

  return (
    <Grid container>
      <Grid item md={3} xs={12}>
        <Formik
          initialValues={{
            id: selectedSetting.id,
            settingKey: selectedSetting.settingKey,
            settingvalue : selectedSetting.settingvalue,
            isActive: selectedSetting.isActive,
          }}
          validateOnChange={false}
          enableReinitialize
          validate={(values) => {
            const errors = {} as any;
            if (values.settingvalue === "") {
              errors.groupName = "Required";
              alertify.error("Alanları Kontrol Ediniz!");
            }

            return errors;
          }}
          onSubmit={(values, actions) => {
            axios
              .post(appConfig.baseApiUrl + "settings/SaveSetting", values)
              .then((resJson) => {
                setGroups(resJson.data);
                setSelectedSetting(initialSetting);
                alertify.success("İşlem Başarılı!");
              });
          }}
        >
          {(formProps) => (
            <form onSubmit={formProps.handleSubmit} style={{ maxWidth: 250 }}>
              <FormGroup>
                <TextField
                  name="settingvalue"
                  label="Email"
                  value={formProps.values.settingvalue}
                  onChange={formProps.handleChange}
                  onBlur={formProps.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isActive"
                      value={formProps.values.isActive}
                      checked={formProps.values.isActive}
                      onChange={formProps.handleChange}
                    />
                  }
                  label="Aktif mi ?"
                />
                <Button color="primary" type="submit">
                  Kaydet
                </Button>
              </FormGroup>
            </form>
          )}
        </Formik>
      </Grid>
      <Grid item md={9} xs={12}>
        <MaterialTable
          title="Grup Listesi"
          columns={[
            { title: "Id", field: "id" },
            { title: "Değeri", field: "settingvalue" },
            { title: "Aktif mi?", field: "isActive" },
          ]}
          data={groups}
          actions={[
            {
              icon: "edit",
              tooltip: "Email Güncelle",
              onClick: (event, rowData) => {
                setSelectedSetting(rowData as any);
              },
            },
            {
              icon: "add",
              tooltip: "Email Ekle",
              isFreeAction: true,
              onClick: (event) => setSelectedSetting(initialSetting),
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            exportButton: true,
            exportCsv: (columns, data) => {
              DownloadExcel("Email Listesi", columns, data);
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
  );
}
