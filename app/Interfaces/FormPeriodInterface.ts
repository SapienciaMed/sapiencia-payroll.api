import { DateTime } from "luxon";

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
}

export interface IFormPeriodFilters {
  idFormType?: number;
  state?: string;
  paidDate?: DateTime;
  page: number;
  perPage: number;
}
