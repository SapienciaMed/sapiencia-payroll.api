import { IDeductionType } from "./DeductionsTypesInterface";

export interface IDeduction {
  id?: number;
  idTypePayroll: number;
  idEmployment: number;
  idTypeDeduction: number;
  value: number;
  patronalValue: number;
  time?: number;
  unitTime?: string;
  deductionType?: IDeductionType[];
  deductionTypeOne?: IDeductionType;
}
