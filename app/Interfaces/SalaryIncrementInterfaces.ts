import { DateTime } from "luxon";

export interface ISalaryIncrement {
  id?: number;
  codCharge: number;
  effectiveDate: DateTime;
  numberActApproval: string;
  porcentualIncrement: boolean;
  incrementValue: number;
  previousSalary: number;
  newSalary: number;
  observation?: string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}
