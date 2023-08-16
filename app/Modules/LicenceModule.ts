declare module "@ioc:core.LicenceProvider" {
  import { ILicenceService } from "App/Services/LicenceService";
  const LicenceProvider: ILicenceService;
  export default LicenceProvider;
}
