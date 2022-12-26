import { injectable } from "inversify";
import "reflect-metadata";
import IAuthService from "../interfaces/ServiceInterfaces/IAuthService";
import * as consts from "../common/consts";
import axios from "axios";
import appConfig from '../config/appConfig';


@injectable()
export default class AuthService implements IAuthService {
  login(user: any): Promise<Response> {
    return axios.post(appConfig.baseApiUrl + "users/authenticate",user);
  }
  public isLoggedIn(): boolean {
    var storage = localStorage.getItem(consts.USER_CONTEXT);
    if (storage !== null) {
      return true;
    } else return false;
  }
}
