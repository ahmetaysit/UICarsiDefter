import React, { useState, useEffect } from "react";
import {
  Grid,
} from "@material-ui/core";
import appConfig from "../../config/appConfig";
import { customerInitialState } from "../../interfaces/ICustomer";
import axios from "axios";
import MaterialTable from "material-table";
import { DownloadExcel } from "../../services/ExcelService";

export default function GroupSummaryReport() {
  const [customers, setCustomers] = useState([customerInitialState]);
  const [transactions, setTransactions] = useState([] as any[]);

  useEffect(() => {
    axios
      .get(appConfig.baseApiUrl + "report/GetLastFiftyTransaction")
      .then((resJson) => {
        setTransactions(resJson.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <MaterialTable
            title="Genel İşlem Listesi"
            columns={[
              { title: "Tarih", field: "dateStr",
              render: rowData=> <span style={{width: 150}}> {rowData.dateStr}</span> },
              { title: "Açıklama", field: "description" },
            ]}
            data={transactions}
            options={{
              actionsColumnIndex: -1,
              exportButton: true,
              exportCsv: (columns, data) => {
                DownloadExcel("Son 50 İşlem", columns, data);
              },
              pageSize: 50,
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
