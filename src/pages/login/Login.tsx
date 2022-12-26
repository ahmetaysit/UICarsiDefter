import React, { Component } from "react";
import { Container, Row, Form, Button, Spinner } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import logo from "../../assets/istanbul.png";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as loginActions from "../../store/actions/loginActions";
import { Redirect } from "react-router-dom";
import alertify from "alertifyjs";
import container from "../../ioc/IocContainer";
import IAuthService from "../../interfaces/ServiceInterfaces/IAuthService";
import TYPES from "../../ioc/types";

class Login extends Component<any, any> {
  authService = container.get<IAuthService>(TYPES.IAuthService);
  _isMounted = false;
  state = {
    username: "",
    password: "",
    isRememberme: false,
    isLoading: false,
    isLoggedIn: false
  };

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  handleChange = event => {
    let name = event.target.name;
    let value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    this.setState({
      [name]: value
    });
  };
  async login() {
    this.setState({ isLoading: true });
    await this.authService
      .login(this.state)
      .then((myJson : any) => {
        if (myJson.data !== null && myJson.data.responseData) {
          alertify.success("giriş başarılı");
          this.props.actions.login(myJson.data.responseData);
          localStorage.setItem("userContext", JSON.stringify(myJson.data.responseData));
          if (this._isMounted) this.setState({ isLoggedIn: true });
        }
      })
      .finally(() => {
        if (this._isMounted) this.setState({ isLoading: false });
      });
  }

  getLoginButton() {
    if (!this.state.isLoading)
      return (
        <Button variant="primary" type="button" onClick={() => this.login()}>
          Login
        </Button>
      );
    else
      return (
        <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Login
        </Button>
      );
  }

  render() {
    if (this.state.isLoggedIn === true) {
      return <Redirect to="/home" />;
    }
    return (
      <div className="login-main">
        <Container className="login-main-container">
          <Row className="justify-content-md-center">
            <Form>
              <Image src={logo} fluid style={{width:"300px"}} />
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Kullanıcı Adı</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Kullanıcı adı giriniz."
                  onChange={this.handleChange}
                  name="username"
                />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Şifre</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Şifre giriniz."
                  onChange={this.handleChange}
                  name="password"
                />
              </Form.Group>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  name="isRememberme"
                  type="checkbox"
                  label="Beni hatırla!"
                  onChange={this.handleChange}
                />
              </Form.Group>
              {this.getLoginButton()}
            </Form>
          </Row>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    usercontext: state.loginReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      login: bindActionCreators(loginActions.login, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
