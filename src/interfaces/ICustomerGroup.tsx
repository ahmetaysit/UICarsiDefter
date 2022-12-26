export interface ICustomerGroup{
    id:number ;
    groupName : string;
    isActive : boolean;
}

export const customerGroupInitialState : ICustomerGroup = {
    id:0 ,
    groupName : "",
    isActive : true
}