import { DateTime } from "luxon";
import { IEmploymentWorker } from "./EmploymentInterfaces";

export interface ITaxDeductible {
  id?: number;
  year: number;
  codEmployment: number;
  type: string;
  value: number;
  state: string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IGetTaxDeductible extends ITaxDeductible {
  employment: IEmploymentWorker;
}

export interface IFilterTaxDeductible {
  page: number;
  perPage: number;
  year: number;
  codEmployment: number;
}
