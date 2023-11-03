import { IFormPeriod } from "./FormPeriodInterface";

export interface IIncome {
  id?: number;
  idTypePayroll: number;
  idEmployment: number;
  idTypeIncome: number;
  value: number;
  time?: number;
  unitTime?: string;
  formPeriod?:IFormPeriod;
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
