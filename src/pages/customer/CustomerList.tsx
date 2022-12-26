import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ICustomer } from "../../interfaces/ICustomer";
import MaterialTable from "material-table";
import { ICustomerGroup } from "../../interfaces/ICustomerGroup";
import appConfig from "../../config/appConfig";
import { connect } from "react-redux";
import {DownloadExcel} from '../../services/ExcelService'

function CustomerList(props) {
  let history = useHistory();
  const [customers, SetCustomers] = useState([] as ICustomer[]);
  const [customerGroups, setCustomerGroups] = useState({});
  const [groups, setGroups] = useState({});

  const getCustomer = () => {
    axios
      .get(appConfig.baseApiUrl + "customer/GetAllCustomers")
      .then((resJson) => {
        SetCustomers(resJson.data as ICustomer[]);
      });
  };
  useEffect(() => {
    if (Object.entries(groups).length === 0 && groups.constructor === Object)
      axios
        .get(appConfig.baseApiUrl + "customer/GetCustomerGroups")
        .then((resJson) => {
          setCustomerGroups(resJson.data);
          var obj = {};
          resJson.data.map((item: ICustomerGroup) => {
            return (obj[item.id] = item.groupName);
          });
          setGroups(obj);
        });
  }, [groups]);

  useEffect(() => {
    if (customers.length === 0) getCustomer();
  }, [customers]);


  const openCustomerForm = (customer) => {
    // history.push("/customer", { customer,customerGroups });
    history.push({pathname:"/customer",state:{ customer,customerGroups }})
  };

  return (
    <div>
      <MaterialTable
        title="Müşteri Listesi"
        columns={[
          { title: "Kodu", field: "id" },
          { title: "Ad Soyadı", field: "customerName" },
          { title: "Telefon", field: "phoneNumber" },
          { title: "Email", field: "email" },
          { title: "Havuz Oranı", field: "poolRate" },
          {
            title: "Müşteri Grubu",
            field: "customerGroupId",
            lookup: groups,
          },
        ]}
        data={customers}
        actions={[
          {
            icon: "edit",
            tooltip: "Müşteri Güncelle",
            onClick: (event, rowData) => {
              if ((rowData as ICustomer[]).length > 0)
                openCustomerForm(rowData[0]);
              else openCustomerForm(rowData);
            },
          },
          {
            icon: "add",
            tooltip: "Müşteri Ekle",
            isFreeAction: true,
            onClick: (event) => openCustomerForm(""),
          },
        ]}
        options={{
          actionsColumnIndex: -1,
          exportButton: true,
          exportCsv :  (columns, data) =>{
            DownloadExcel("Müşteri Listesi",columns,data);
          },
          pageSize:50,
          pageSizeOptions:[50,100,200]
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerList);
