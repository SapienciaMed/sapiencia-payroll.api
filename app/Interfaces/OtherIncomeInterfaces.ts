import { DateTime } from "luxon";
import { IEmploymentWorker } from "./EmploymentInterfaces";
import { IIncomeType } from "./IncomeTypesInterfaces";

export interface IOtherIncome {
  id?: number;
  codTypeIncome: number;
  codEmployment: number;
  codPayroll: number;
  value: number;
  state: string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IGetOtherIncome extends IOtherIncome {
  employment: IEmploymentWorker;
  typeIncome: IIncomeType;
}

export interface IFilterOtherIncome {
  page: number;
  perPage: number;
  codPayroll: number;
  codEmployment: number;
}
