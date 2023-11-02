declare module "@ioc:core.ReportProvider" {
  import { IReportService } from "App/Services/ReportsService";
  const ReportProvider: IReportService;
  export default ReportProvider;
}
