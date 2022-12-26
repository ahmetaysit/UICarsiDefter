import { Container } from "inversify";
import AuthService from "../services/Auth-Service";
import IAuthService from "../interfaces/ServiceInterfaces/IAuthService";
import TYPES from "./types";

var container = new Container();
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

export default container;