import { DateTime } from "luxon";

export interface IManualDeduction {
  id?: number;
  codEmployment: number;
  codDeductionType?: number;
  cyclic: boolean;
  totalMount?:number;
  numberInstallments?: number;
  applyExtraordinary?: boolean;
  porcentualValue?:boolean;
  value: number;
  codFormsPeriod?: number;
  state: string;
  observation?:string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IManualDeductionFilters{
  codEmployment: number;
  codFormsPeriod?: number;
  typeDeduction?: string;
  page: number;
  perPage: number;
}