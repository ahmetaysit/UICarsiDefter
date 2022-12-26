import React, { Component } from "react";
import {
  Grid,
  TextField,
  Button,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  Checkbox
} from "@material-ui/core";
import {
  ICustomerGroup,
} from "../../interfaces/ICustomerGroup";
import { ICustomer, customerInitialState } from "../../interfaces/ICustomer";
import axios from "axios";
import alertify from "alertifyjs";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import appConfig from '../../config/appConfig';

interface CustomerAddNewState {
  customer: ICustomer;
  groups: ICustomerGroup[];
}
interface CustomerAddNewprops {}

export default class CustomerAddNew extends Component<
  CustomerAddNewprops,
  CustomerAddNewState
> {
  constructor(props) {
    super(props);
    this.state = {
      customer: customerInitialState,
      groups: []
    };
    this.handleCustomerChange = this.handleCustomerChange.bind(this);
  }

  componentDidMount() {
    if (this.state.customer) {
    }
  }
  handleCustomerChange(e: any) {
    e.preventDefault();
    const { customer } = { ...this.state };
    const currentState = customer;
    const { name, value } = e.target;
    var newValue;
    if(e.target.type ==="checkbox")
    {
      
        newValue = e.target.checked;
    }
    else if (e.target.type ==="number")
    {
        newValue =  e.target.valueAsNumber;
    }
    else
    {
        newValue = value;
    }
    currentState[name] = newValue;

    this.setState({ customer: currentState });
    // this.setState((state) => {
    //     return {[name]: value} as CustomerAddNewState;
    //   });
  }

  save() {
    if (this.state.customer) {
    }
    var formValue: ICustomer = this.state.customer;
    alertify.confirm(
      "Confirm Message",
      function() {
        axios
          .post(appConfig.baseApiUrl + "customer/SaveCustomer", formValue)
          .then(data => {
            alertify.success("Ok");
          });
      },
      function() {
        alertify.error("Cancel");
      }
    );
  }
  //   handleChange"(field, name, e) {
  //     this.setState({[field]: { ...this.state[field], [name]:e.target.value } } as CustomerAddNewState);
  //   }
  render() {
    return (
      <div>
        <Grid container>
          <FormGroup>
            <TextField
              required
              name="customerName"
              value={this.state.customer.customerName}
              label="Müşteri Adı Soyadı"
              onChange={this.handleCustomerChange}
              // onChange={this.handleChange.bind(this, 'lineup', el)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="number"
              name="phoneNumber"
              value={this.state.customer.phoneNumber}
              label="Telefon Numarası"
              onChange={this.handleCustomerChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="email"
              value={this.state.customer.email}
              label="E-Posta"
              onChange={this.handleCustomerChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="number"
              name="poolRate"
              value={this.state.customer.poolRate}
              label="Havuz Oranı"
              onChange={this.handleCustomerChange}
              InputLabelProps={{ shrink: true }}
            />
            <InputLabel id="customerGroupId-label" shrink={true}>
              Müşteri Grubu
            </InputLabel>
            <Select
              type="select"
              labelId="customerGroupId-label"
              name="customer.customerGroupId"
              value={this.state.customer.customerGroupId}
              onChange={this.handleCustomerChange}
              // label="Müşteri Grubu"
            >
              <MenuItem value={0} key={0}>
                Hiçbiri
              </MenuItem>
              {this.state.groups.map((item, i) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.groupName}
                  </MenuItem>
                );
              })}
            </Select>
            <FormControlLabel
              control={
                <Checkbox
                  name="isActive"
                  checked={this.state.customer.isActive}
                  onChange={this.handleCustomerChange}
                  value={this.state.customer.isActive}
                  color="primary"
                />
              }
              label="Primary"
            />
            <Button onClick={() => this.save()} color="primary">
              Kaydet
            </Button>
          </FormGroup>
        </Grid>
      </div>
    );
  }
}
