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

export default function UserList() {
  const [users, setusers] = useState([]);
  const initialUser = {
    id: 0,
    nameSurname: "",
    username: "",
    isActive: true,
    isAdmin: false,
    cantSeeBalance:false,
    password: "",
  };
  const [selectedUser, setselectedUser] = useState(initialUser);

  useEffect(() => {
    axios.get(appConfig.baseApiUrl + "users/GetAll").then((resJson) => {
      setusers(resJson.data);
    });
  }, []);

  return (
    <Grid container>
      <Grid item md={3} xs={12}>
        <Formik
          initialValues={{
            id: selectedUser.id,
            nameSurname: selectedUser.nameSurname,
            username: selectedUser.username,
            isActive: selectedUser.isActive,
            isAdmin: selectedUser.isAdmin,
            password: selectedUser.password,
            cantSeeBalance:selectedUser.cantSeeBalance,
          }}
          validateOnChange={false}
          enableReinitialize
          validate={(values) => {
            const errors = {} as any;
            // if (values.groupName === "") {
            //   errors.groupName = "Required";
            //   alertify.error("Alanları Kontrol Ediniz!");
            // }

            return errors;
          }}
          onSubmit={(values, actions) => {
            axios
              .post(appConfig.baseApiUrl + "users/SaveUser", values)
              .then((resJson) => {
                if (resJson.data.responseCode === 200) {
                  setusers(resJson.data.responseData);
                  setselectedUser(initialUser);
                  alertify.success("İşlem Başarılı!");
                }
                else{
                    alertify.error(resJson.data.responseMessage)
                }
              });
          }}
        >
          {(formProps) => (
            <form onSubmit={formProps.handleSubmit} style={{ maxWidth: 250 }}>
              <FormGroup>
                <TextField
                  name="nameSurname"
                  label="Ad Soyad"
                  value={formProps.values.nameSurname}
                  onChange={formProps.handleChange}
                  onBlur={formProps.handleBlur}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="username"
                  label="Kullanıcı Adı"
                  value={formProps.values.username}
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
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isAdmin"
                      value={formProps.values.isAdmin}
                      checked={formProps.values.isAdmin}
                      onChange={formProps.handleChange}
                    />
                  }
                  label="Admin mi ?"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="cantSeeBalance"
                      value={formProps.values.cantSeeBalance}
                      checked={formProps.values.cantSeeBalance}
                      onChange={formProps.handleChange}
                    />
                  }
                  label="Bakiye Göremez ?"
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
            { title: "Adı Soyadı", field: "nameSurname" },
            { title: "Aktif mi?", field: "isActive" },
            { title: "Admin mi?", field: "isAdmin" },
            { title: "Bakiye Göremez?", field: "cantSeeBalance" },
          ]}
          data={users}
          actions={[
            {
              icon: "edit",
              tooltip: "Kullanıcı Güncelle",
              onClick: (event, rowData) => {
                setselectedUser(rowData as any);
              },
            },
            {
              icon: "add",
              tooltip: "Kullanıcı Ekle",
              isFreeAction: true,
              onClick: (event) => {setselectedUser(initialUser)},
            },
          ]}
          options={{
            actionsColumnIndex: -1,
            exportButton: true,
            exportCsv: (columns, data) => {
              DownloadExcel("Kullanıcı Listesi", columns, data);
            },
            pageSize: 10,
            pageSizeOptions: [10, 20, 30],
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
