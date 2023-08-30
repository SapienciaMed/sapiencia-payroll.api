declare module "@ioc:core.ManualDeductionProvider" {
  import { IManualDeductionService } from "App/Services/ManualDeductionService";
  const ManualDeductionProvider: IManualDeductionService;
  export default ManualDeductionProvider;
}
