import { DateTime } from "luxon";
import { IHistoricalPayroll } from "./HistoricalPayrollInterfaces";
import { IDeduction } from "./DeductionsInterfaces";
import { IIncome } from "./IncomeInterfaces";
import { IBooking } from "./BookingInterfaces";

export interface IFormPeriod {
  id?: number;
  idFormType: number;
  state: string;
  dateStart: DateTime;
  dateEnd: DateTime;
  paidDate: DateTime;
  month: number;
  year: number;
  observation?: string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;

  historicalPayroll?: IHistoricalPayroll[];
  deductions?: IDeduction[];
  incomes?: IIncome[];
  reserves?: IBooking[];
}

export interface IFormPeriodFilters {
  idFormType?: number;
  state?: string;
  paidDate?: DateTime;
  page: number;
  perPage: number;
}
