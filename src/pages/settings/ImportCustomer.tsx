import React, { useRef } from "react";
import XLSX from "xlsx";
import MaterialTable from "material-table";
import { DownloadExcel } from "../../services/ExcelService";
import axios from "axios";
import appConfig from "../../config/appConfig";
import { useHistory } from "react-router-dom";
import alertify from "alertifyjs";

export default function ImportCustomer(props) {
  let history = useHistory();
  const [state, setState] = React.useState({
    file: {} as any,
    data: [],
  });
  const [customers, setCustomer] = React.useState([]);
  const fileUploader = useRef(null) as any;
  const handleChange = (e) => {
    const files = e.target.files;
    var tmpstate = state;
    tmpstate.file = files[0];
    if (files && files[0]) setState(tmpstate);
    handleFile();
  };
  const handleClick = (e) => {
    fileUploader.current?.click();
  };
  const handleFile = () => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      const bstr = e.target?.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      var tmp = state;
      tmp.data = data;
      setState(tmp);
      setCustomer(data);
    };

    if (rABS) {
      reader.readAsBinaryString(state.file);
    } else {
      reader.readAsArrayBuffer(state.file);
    }
  };
  const saveBulkCustomer = () => {
    axios
      .post(appConfig.baseApiUrl + "settings/SaveBulkCustomer", state.data)
      .then((resJson) => {
        if (resJson.data === "Ok") {
          alertify.success("Başarılı");
          history.push("/customerlist");
        }
      });
  };
  return (
    <div>
      <input
        type="file"
        ref={fileUploader}
        className="form-control"
        id="file"
        accept={[
          "xlsx",
          "xlsb",
          "xlsm",
          "xls",
          "xml",
          "csv",
          "txt",
          "ods",
          "fods",
          "uos",
          "sylk",
          "dif",
          "dbf",
          "prn",
          "qpw",
          "123",
          "wb*",
          "wq*",
          "html",
          "htm",
        ]
          .map(function (x) {
            return "." + x;
          })
          .join(",")}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <MaterialTable
        title="Müşteri Listesi"
        columns={[
          { title: "Ad Soyadı", field: "customerName" },
          { title: "Telefon", field: "phoneNumber", type: "numeric" },
          { title: "Email", field: "email" },
          { title: "Havuz Oranı", field: "poolRate", type: "numeric" },
          {
            title: "Müşteri Grubu",
            field: "customerGroupId",
            lookup: props.groups,
          },
          { title: "Tarih", field: "transactionDate", type: "date" },
          { title: "TL", field: "tl", type: "numeric" },
          { title: "USD", field: "usd", type: "numeric" },
          { title: "EUR", field: "eur", type: "numeric" },
          { title: "GAU", field: "gau", type: "numeric" },
          { title: "GBP", field: "gbp", type: "numeric" },
        ]}
        data={customers}
        actions={[
          {
            icon: "add",
            tooltip: "Dosya Ekle",
            isFreeAction: true,
            onClick: (event) => handleClick(event),
          },
          {
            icon: "save",
            tooltip: "Kaydet",
            isFreeAction: true,
            onClick: (event) =>
              alertify.confirm(
                "Onay",
                "Müşteriler yüklenecek onaylıyor musunuz ?",
                function () {
                  saveBulkCustomer();
                },
                function () {
                  alertify.error("İptal Edildi");
                }
              ),
          },
        ]}
        options={{
          actionsColumnIndex: -1,
          exportButton: false,
          exportCsv: (columns, data) => {
            DownloadExcel("Müşteri Listesi", columns, data);
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
    </div>
  );
}
