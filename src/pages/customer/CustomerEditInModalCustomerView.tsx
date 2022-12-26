import React, { useEffect, useState } from "react";
import {
  baseFormReducer,
  baseCallBack
} from "../../store/reducers/baseFormReducer";
import {
  Grid,
  TextField,
  Button,
  FormGroup,
  Select,
  MenuItem,
  InputLabel
} from "@material-ui/core";
import axios from "axios";
import alertify from "alertifyjs";
import { customerInitialState } from "../../interfaces/ICustomer";
import appConfig from '../../config/appConfig';

interface IGroup {
  id: number;
  groupName: String;
  isActive: boolean;
}

export default function CustomerEditInModalCustomerView(props) {
  const save = () => {
    alertify.confirm(
      "Confirm Message",
      function() {
        axios
          .post(appConfig.baseApiUrl + "customer/SaveCustomer", state.customer)
          .then(data => {
            alertify.success("Ok");
            props.handleClose();
          });
      },
      function() {
        alertify.error("Cancel");
        props.handleClose();
      },
    );
  };
  const [state, updateState] = React.useReducer(baseFormReducer, {
    customer: customerInitialState
  });
  const [groups, updateGroups] = useState([] as IGroup[]);
  const updateForm = React.useCallback(({ target: { value, name, type } }) => {
    baseCallBack({ value, name, type }, updateState);
  }, []);

  useEffect(() => {
    if (groups.length === 0)
      axios
        .get(appConfig.baseApiUrl + "customer/GetCustomerGroups")
        .then(resJson => {
          updateGroups(resJson.data);
        });
  }, [groups]);
  useEffect(() => {
    if (props.customer.id > 0) {
      baseCallBack(
        { value: props.customer, name: "customer", type: Object },
        updateState
      );
    }
  }, [props.customer]);

  return (
    <div>
      <Grid container>
        <FormGroup>
          <TextField
            required
            name="customer.customerName"
            value={state.customer.customerName}
            label="Müşteri Adı Soyadı"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="number"
            name="customer.phoneNumber"
            value={state.customer.phoneNumber ||""}
            label="Telefon Numarası"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="customer.email"
            value={state.customer.email}
            label="E-Posta"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="number"
            name="customer.poolRate"
            value={state.customer.poolRate}
            label="Havuz Oranı"
            onChange={updateForm}
            InputLabelProps={{ shrink: true }}
          />
          <InputLabel id="customerGroupId-label" shrink={true}>
            Müşteri Grubu
          </InputLabel>
          <Select
            type="select"
            labelId="customerGroupId-label"
            name="customer.customerGroupId"
            value={state.customer.customerGroupId}
            onChange={updateForm}
            // label="Müşteri Grubu"
          >
            <MenuItem value={0} key={0}>
              Hiçbiri
            </MenuItem>
            {groups.map((item, i) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.groupName}
                </MenuItem>
              );
            })}
          </Select>
          <Button onClick={() => save()} color="primary">
            Kaydet
          </Button>
        </FormGroup>
      </Grid>
    </div>
  );
}
