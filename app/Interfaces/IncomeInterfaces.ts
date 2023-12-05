import { IFormPeriod } from "./FormPeriodInterface";
import { IIncomeType } from "./IncomeTypesInterfaces";

export interface IIncome {
  id?: number;
  idTypePayroll: number;
  idEmployment: number;
  idTypeIncome: number;
  value: number;
  time?: number;
  unitTime?: string;
  formPeriod?: IFormPeriod;
  incomeType?: IIncomeType;
}

export interface IIncomePayroll {
  id: number;
  idTypePayroll: number;
  idEmployment: number;
  idTypeIncome: number;
  value: number;
  time?: number;
  unitTime?: string;
  formPeriod: IFormPeriod;
}
