export default interface IConfiguration {
  baseApiUrl: string;

  projectName: string;

  screenList: { [key: string]: any };

  topBarRightButtons: [{}];
}
