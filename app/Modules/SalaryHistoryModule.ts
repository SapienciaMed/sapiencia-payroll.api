declare module "@ioc:core.SalaryHistoryProvider" {
  import { ISalaryHistoryService } from "App/Services/SalaryHistoryService";
  const salaryHistoryProvider: ISalaryHistoryService;
  export default salaryHistoryProvider;
}
