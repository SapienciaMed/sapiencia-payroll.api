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

export interface ISalaryEditIncrement {
  id: number;
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

export interface ISalaryIncrementsFilters{
  codCharge?:number;
  numberActApproval?: string;
  page: number;
  perPage: number;
}