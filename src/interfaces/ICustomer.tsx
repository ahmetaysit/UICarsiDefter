export interface ICustomer {
      id: number;
      customerCode: string;
      customerName: string;
      defaultCurrencyId: number;
      phoneNumber: number;
      email: string;
      poolRate: number;
      isActive: boolean;
      customerGroupId: number;
      isJustForBalance: boolean;
  }
export const customerInitialState: ICustomer = {

      id: 0,
      customerCode: "",
      customerName: "",
      defaultCurrencyId: 0,
      phoneNumber: 0,
      email: "",
      poolRate: 0,
      isActive: true,
      customerGroupId: 0,
      isJustForBalance: false
  };