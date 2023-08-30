import { DateTime } from "luxon";

export interface IManualDeduction {
  id?: number;
  codEmployment: number;
  codDeductionType?: number;
  cyclic: boolean;
  numberInstallments?: number;
  applyExtraordinary?: boolean;
  value: number;
  codFormsPeriod?: number;
  state: string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate: string;
  dateCreate: DateTime;
}
