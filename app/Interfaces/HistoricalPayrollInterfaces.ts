export interface IHistoricalPayroll {
  id: number;
  idTypePayroll: number;
  idEmployment: number;
  workedDay: number;
  salary: number;
  totalIncome: number;
  totalDeduction: number;
  total: number;
  state: string;
  observation: string;
}
