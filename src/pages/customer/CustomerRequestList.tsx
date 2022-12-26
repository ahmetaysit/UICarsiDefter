import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialTable from "material-table";
import appConfig from "../../config/appConfig";
import { connect } from "react-redux";
import alertify from "alertifyjs";

function CustomerRequestList(props) {
  const [transactions, setTransactions] = useState([]);
  const getTransactions = () => {
    axios
      .get(appConfig.baseApiUrl + "customer/GetCustomerRequestList")
      .then((resJson) => {
        setTransactions(resJson.data);
      });
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div>
      <MaterialTable
        title="Müşteri Açma Talep Listesi"
        columns={[
          { title: "Müşteri Adı", field: "customerName" },
          { title: "Tutar", field: "amount" },
          { title: "işlem Tarihi", field: "transactionDate", type: "date" },
          { title: "Döviz", field: "currency" },
          { title: "Statü", field: "status" },
        ]}
        data={transactions}
        actions={[
          {
            icon: "check",
            tooltip: "Onayla",
            onClick: (event, rowData:any) => {
              alertify.confirm(
                "Onay",
                "Tüm Bilgiler Silinecektir onaylıyor musunuz?",
                function () {
                  axios
                    .post(
                      appConfig.baseApiUrl +
                        "Customer/ApproveCustomerRequest?id="+rowData.id,
                      rowData
                    )
                    .then((resJson) => {
                      setTransactions(resJson.data);
                      alertify.success("İşlem Onaylandı!");
                    });
                },
                function () {
                  alertify.warning("İptal Edildi");
                }
              );
            },
          },
          {
            icon: "clear",
            tooltip: "Reddet",
            onClick: (event, rowData:any) => {
              alertify.confirm(
                "Onay",
                "Tüm Bilgiler Silinecektir onaylıyor musunuz?",
                function () {
                  axios
                    .post(
                      appConfig.baseApiUrl +
                        "Customer/RejectCustomerRequest?id="+rowData.id,
                      null
                    )
                    .then((resJson) => {
                      setTransactions(resJson.data);
                      alertify.error("İşlem Reddedildi!");
                    });
                },
                function () {
                  alertify.warning("İptal Edildi");
                }
              );
            },
          },
        ]}
        options={{
          actionsColumnIndex: -1,
          exportButton: true,
          pageSize: 10,
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
            exportTitle: "Dosyaya çıkar",
            searchTooltip: "Ara",
            searchPlaceholder: "Aranacak kelimeyi giriniz",
          },
        }}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    isLoading: state.loadingReducer,
    totalRequest: state.totalRequestReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {},
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerRequestList);
