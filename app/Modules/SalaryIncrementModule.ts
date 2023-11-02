declare module "@ioc:core.SalaryIncrementProvider" {
  import { ISalaryIncrementService } from "App/Services/SalaryIncrementService";
  const salaryIncrementProvider: ISalaryIncrementService;
  export default salaryIncrementProvider;
}
