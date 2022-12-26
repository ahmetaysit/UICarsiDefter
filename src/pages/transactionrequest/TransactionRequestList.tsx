import React, { useEffect, useState } from "react";
import axios from "axios";
import MaterialTable from "material-table";
import appConfig from "../../config/appConfig";
import { connect } from "react-redux";
import alertify from "alertifyjs";

function TransactionRequestList(props) {
  const [transactions, setTransactions] = useState([]);
  const getTransactions = () => {
    axios
      .get(appConfig.baseApiUrl + "transaction/GetTransactionRequests")
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
        title="Talep Edilen İşlem Listesi"
        columns={[
          { title: "İşlem Tipi", field: "tranSactionType" },
          { title: "Müşteri Adı", field: "customerName" },
          { title: "Tutar", field: "amount" },
          { title: "Giriş Hesabı", field: "toAccount" },
          { title: "Çıkış Hesabı", field: "fromAccount" },
          { title: "Alış Kuru", field: "buyingRate" },
          { title: "Satış Kuru", field: "sellingRate" },
          { title: "Statü", field: "status" },
          { title: "Açan Kullanıcı", field: "createdUser" },
          { title: "işlem Tarihi", field: "transactionDate", type: "date" },
          //   { title: "Açılış Tarihi", field: "createdDate" },
        ]}
        data={transactions}
        actions={[
          {
            icon: "check",
            tooltip: "Onayla",
            onClick: (event, rowData) => {
              alertify.confirm(
                "Onay",
                "Tüm Bilgiler Silinecektir onaylıyor musunuz?",
                function () {
                  axios
                    .post(
                      appConfig.baseApiUrl +
                        "transaction/ApproveTransactionRequest",
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
            onClick: (event, rowData) => {
              alertify.confirm(
                "Onay",
                "Tüm Bilgiler Silinecektir onaylıyor musunuz?",
                function () {
                  axios
                    .post(
                      appConfig.baseApiUrl +
                        "transaction/RejectTransactionRequest",
                      rowData
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
)(TransactionRequestList);
