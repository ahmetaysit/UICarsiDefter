import React from "react";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import appConfig from "../../config/appConfig";
import MaterialTable from "material-table";

export default function CustomerAccountList(props) {
  return (
    <div>
      <div>
        <MaterialTable
          title="Müşteri Hesapları Listesi"
          columns={[
            { title: "Hesap No", field: "accountNo" },
            { title: "Döviz Cinsi", field: "currencyName" },
            { title: "Son Bakiye", field: "calculatedLastAccountBalance" },
            { title: "Havuza Çıkacak Tutar", field: "amountToPool" },
            { title: "Bakiye", field: "accountBalance" },
          ]}
          options={{ pageSize: 10, pageSizeOptions: [10, 20, 30] }}
          data={props.customerAccounts}
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
              exportTitle: "Dosyaya çıkar",
              // exportAriaLabel?: string;
              // exportName?: string;
              searchTooltip: "Ara",
              searchPlaceholder: "Aranacak kelimeyi giriniz",
            },
          }}
        />
      </div>
    </div>
  );
}
