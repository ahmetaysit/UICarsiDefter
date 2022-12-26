import React from "react";
import { FormGroup, Button, Grid } from "@material-ui/core";
import axios from "axios";
import alertify from "alertifyjs";
import appConfig from "../../config/appConfig";

export default function ResetData(props) {
  const resetAllData = () => {
    alertify.confirm(
      "Onay",
      "Tüm Bilgiler Silinecektir onaylıyor musunuz?",
      function () {
        axios
          .post(appConfig.baseApiUrl + "settings/DeleteAllData")
          .then((resJson) => {
            alertify.success("İşlem Başarılı");
          });
      },
      function () {
        alertify.error("İptal Edildi");
      }
    );
  };

  return (
    <div>
      <Grid container>
        <FormGroup>
          <Button color="primary" onClick={() => resetAllData()}>
            Tüm Bilgileri Sıfırla{" "}
          </Button>
        </FormGroup>
      </Grid>
    </div>
  );
}
