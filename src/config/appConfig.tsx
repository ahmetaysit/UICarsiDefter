import IConfiguration from "../ioc/IConfiguration";
import CustomerList from "../pages/customer/CustomerList";
import * as icons from "@material-ui/icons";
import DashBoard from "../pages/dashboard/DashBoard";
import Customer from "../pages/customer/Customer";
import Profile from "../pages/profile/Profile";
import CustomerAddNew from "../pages/customer/CustomerAddNew";
import DailyProfitAdd from "../pages/dailyprofitadd/DailyProfitAdd";
import EndOfMonthTransaction from "../pages/endofmonthtransaction/EndOfMonthTransaction";
import ShopProfitEntry from "../pages/shopprofitentry/ShopProfitEntry";
import CustomerTransactionReport from "../pages/reports/CustomerTransactionReport";
import GeneralTransactionReport from "../pages/reports/GeneralTransactionReport";
import TransactionRequestList from "../pages/transactionrequest/TransactionRequestList";
import Settings from "../pages/settings/Settings";
import CustomerGroup from "../pages/customer/CustomerGroup";
import SmsRequestList from "../pages/reports/SmsRequestList";
import UserList from "../pages/users/UserList";
import SmsExcelList from "../pages/reports/SmsExcelList";
import CustomerAddNewSummary from "../pages/customer/CustomerAddNewSummary";
import EmailSendingList from "../pages/settings/EmailSendingList";
import GroupSummaryReport from "../pages/reports/GroupSummaryReport";
import CustomerRequestList from "../pages/customer/CustomerRequestList";
import CustomerListShort from "../pages/customer/CustomerListShort";
import CustomerForExchangeWithRate from "../pages/customer/CustomerForExchangeWithRate";
import LastFiftyTransaction from "../pages/reports/LastFiftyTransaction";

const config = {
  projectName: "Çarşı Defter",
  baseApiUrl: "https://api.carsidefter.xyz/",
  // baseApiUrl: "https://localhost:44370/",
  screenList: [
    {
      link: "home",
      component: DashBoard,
      displayName: "Anasayfa",
      icon: icons.Home,
      isVisible: true,
      onlyAdmin: false,
    },
    {
      link: "customerlist",
      component: CustomerList,
      displayName: "Müşteri Listesi",
      icon: icons.Hotel,
      isVisible: true,
      onlyAdmin: false,
    },
    {
      link: "customerListShort",
      component: CustomerListShort,
      displayName: "Müşteri Listesi Özet",
      icon: icons.Hotel,
      isVisible: false,
      onlyAdmin: false,
    },
    {
      link: "groupList",
      component: CustomerGroup,
      displayName: "Grup Tanımları",
      icon: icons.GroupAdd,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "customerRequestList",
      component: CustomerRequestList,
      displayName: "Onaya Gelen Müşteri İşlemleri",
      icon: icons.DoneAll,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "transactionrequestlist",
      component: TransactionRequestList,
      displayName: "Onaya Gelen İşlemler",
      icon: icons.DoneAll,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "customer",
      component: Customer,
      displayName: "Müşteri",
      icon: icons.Hotel,
      isVisible: false,
      onlyAdmin: false,
    },
    {
      link: "customerForExchangeWithRate",
      component: CustomerForExchangeWithRate,
      displayName: "Müşteri",
      icon: icons.Hotel,
      isVisible: false,
      onlyAdmin: false,
    },
    {
      link: "customeraddnew",
      component: CustomerAddNew,
      displayName: "Müşteri Ekle Yeni",
      icon: icons.Hotel,
      isVisible: false,
      onlyAdmin: false,
    },
    {
      link: "dailyprofitadd",
      component: DailyProfitAdd,
      displayName: "Günlük Kar Girişi",
      icon: icons.AttachMoney,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "billingprocess",
      component: EndOfMonthTransaction,
      displayName: "Hesap Kesim İşlemi",
      icon: icons.CalendarToday,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "shopprofitentry",
      component: ShopProfitEntry,
      displayName: "Dükkan Kar Girişi",
      icon: icons.Money,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "customertransactionreport",
      component: CustomerTransactionReport,
      displayName: "Müşteri İşlem Raporu",
      icon: icons.Report,
      isVisible: true,
      onlyAdmin: false,
      hasBalance : true,
    },
    {
      link: "groupSummaryReport",
      component: GroupSummaryReport,
      displayName: "Group Özet Raporu",
      icon: icons.GroupWork,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "generaltransactionreport",
      component: GeneralTransactionReport,
      displayName: "Genel İşlem Raporu",
      icon: icons.Today,
      isVisible: true,
      onlyAdmin: false,
      hasBalance : true,
    },
    {
      link: "lastFiftyTransaction",
      component: LastFiftyTransaction,
      displayName: "Son 50 İşlem",
      icon: icons.Today,
      isVisible: false,
      onlyAdmin: false,
    },
    {
      link: "smsExcelList",
      component: SmsExcelList,
      displayName: "Ay Sonu Sms Raporu",
      icon: icons.Today,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "settings",
      component: Settings,
      displayName: "Ayarlar",
      icon: icons.Settings,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "userList",
      component: UserList,
      displayName: "Kullanıcı Listesi",
      icon: icons.VerifiedUser,
      isVisible: true,
      onlyAdmin: true,
    },
    {
      link: "profile",
      component: Profile,
      dislpayName: "Profil",
      isVisible: false,
      onlyAdmin: false,
    },
    {
      link: "emailSendingList",
      component: EmailSendingList,
      dislpayName: "Email Listesi",
      isVisible: false,
      onlyAdmin: false,
    },
    
    {
      link: "customerAddNewSummary",
      component: CustomerAddNewSummary,
      dislpayName: "Müşteri Ekle Kısa",
      isVisible: false,
      onlyAdmin: false,
    },
    
  ],
  topBarRightButtons: [{ link: "profile", displayName: "Profil" }],
} as IConfiguration;

export default config;
