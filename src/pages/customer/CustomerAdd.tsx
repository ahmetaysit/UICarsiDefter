import React, { useEffect, useState } from "react";
import {
  baseFormReducer,
  baseCallBack,
} from "../../store/reducers/baseFormReducer";
import {
  Grid,
  TextField,
  Button,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import axios from "axios";
import alertify from "alertifyjs";
import { customerInitialState } from "../../interfaces/ICustomer";
import { Redirect } from "react-router-dom";
import appConfig from "../../config/appConfig";

interface IGroup {
  id: number;
  groupName: String;
  isActive: boolean;
}

export default function CustomerAdd(props) {
  const save = () => {
    if (state.customer) {
    }
    alertify.confirm(
      "Confirm Message",
      function () {
        axios
          .post(appConfig.baseApiUrl + "customer/SaveCustomer", state.customer)
          .then((data) => {
            alertify.success("Ok");
            updateisRedirect(true);
          });
      },
      function () {
        alertify.error("Cancel");
      }
    );
  };
  const [state, updateState] = React.useReducer(baseFormReducer, {
    customer: customerInitialState,
  });
  const [isRedirect, updateisRedirect] = useState(false);
  const [groups, updateGroups] = useState([] as IGroup[]);
  const updateForm = React.useCallback(({ target: { value, name, type } }) => {
    baseCallBack({ value, name, type }, updateState);
  }, []);

  useEffect(() => {
    if (props.groups.length > 0) updateGroups(props.groups);
  }, [props.groups]);
  useEffect(() => {
    if (props.customer.id > 0) {
      baseCallBack(
        { value: props.customer, name: "customer", type: Object },
        updateState
      );
    }
  }, [props.customer]);

  if (isRedirect === true) {
    return <Redirect to="/customerlist" />;
  }
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
            value={state.customer.phoneNumber || ""}
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
                <MenuItem key={i} value={item.id}>
                  {item.groupName}
                </MenuItem>
              );
            })}
          </Select>
          <FormControlLabel
            control={
              <Checkbox
                name="customer.isActive"
                value={state.customer.isActive}
                checked={state.customer.isActive}
                onChange={updateForm}
                color="primary"
              />
            }
            label="Aktif mi?"
          />
          <div style={{ flexDirection: "row" }}>
            <Button onClick={() => save()} color="primary">
              Kaydet
            </Button>
            <Button onClick={() => updateisRedirect(true)} color="secondary">
              İptal
            </Button>
          </div>
        </FormGroup>
      </Grid>
    </div>
  );
}
