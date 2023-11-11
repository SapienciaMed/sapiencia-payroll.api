declare module "@ioc:core.ChargeProvider" {
  import { IChargeService } from "App/Services/ChargesService";
  const ChargeProvider: IChargeService;
  export default ChargeProvider;
}
