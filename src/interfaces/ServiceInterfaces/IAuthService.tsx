export default interface IAuthService{
    isLoggedIn() : boolean;
    login(user) : Promise<Response>;
}