declare module "@ioc:core.Vinculation" {
  import { IVinculationService } from "App/Services/VinculationService";

  const VinculationProvider: IVinculationService;
  export default VinculationProvider;
}
