import { DateTime } from "luxon";

export interface ICharge {
  id?: number;
  name?: string;
  codUnit: number;
  codChargeType: number;
  baseSalary: number;
  state: string;
  userModify?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}
