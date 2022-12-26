import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Grid, TextField, FormGroup, Button } from "@material-ui/core";
import { connect } from "react-redux";
import axios from "axios";
import alertify from "alertifyjs";
import appConfig from "../../config/appConfig";

function Profile(props: any) {
  const [user, setUser] = useState({ id: 0, nameSurname: "", username: "" });
  useEffect(() => {
    if (props.userContext.id > 0) {
      getUser();
    }
  }, [props.userContext.id]);

  const getUser = () => {
    axios.get(appConfig.baseApiUrl + "users/GetUser").then((resJson) => {
      setUser(resJson.data);
    });
  };

  return (
    <div>
      <Grid container>
        <Grid item md={3} xs={12}>
          <Formik
            initialValues={{
              id: user.id,
              nameSurname: user.nameSurname,
              userName: user.username,
              password: "",
              passwordConfirm: "",
            }}
            validateOnChange={false}
            enableReinitialize
            validate={(values) => {
              const errors = {} as any;

              if (values.password !== values.passwordConfirm) {
                errors.passwordConfirm = "Girilen şifreler aynı olmalıdır";
              }

              return errors;
            }}
            onSubmit={(values, actions) => {
              axios
                .post(appConfig.baseApiUrl + "users/SaveMyProfile", values)
                .then((resJson) => {
                  alertify.success("Başarılı");
                  getUser();
                });
            }}
          >
            {(formProps) => (
              <form onSubmit={formProps.handleSubmit} style={{ maxWidth: 250 }}>
                <FormGroup>
                  <TextField
                    name="nameSurname"
                    label="Ad Soyad"
                    value={formProps.values.nameSurname}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    name="userName"
                    label="Kullanıcı Adı"
                    value={formProps.values.userName}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    name="password"
                    type="password"
                    label="Yeni Şifre"
                    value={formProps.values.password}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    name="passwordConfirm"
                    type="password"
                    label="Yeni Şifre Onayla"
                    value={formProps.values.passwordConfirm}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                    InputLabelProps={{ shrink: true }}
                  />
                  {formProps.errors.passwordConfirm &&
                  formProps.touched.passwordConfirm ? (
                    <div style={{ color: "red" }}>
                      {formProps.errors.passwordConfirm}
                    </div>
                  ) : null}
                  <Button color="primary" type="submit">
                    Kaydet
                  </Button>
                </FormGroup>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userContext: state.loginReducer,
    isLoading: state.loadingReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
