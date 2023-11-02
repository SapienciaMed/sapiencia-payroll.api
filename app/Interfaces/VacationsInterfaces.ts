import { DateTime } from "luxon";
import { IVacationDay } from "./VacationDaysInterface";

export interface IVacation {
  id?: number;
  codEmployment: number;
  period: number;
  dateFrom: DateTime;
  dateUntil: DateTime;
  periodFormer: number;
  enjoyed: number;
  refund: number;
  available: number;
  days?: number;
  periodClosed: boolean;
}

export interface IVacationResult {
  id?: number;
  codEmployment: number;
  period: number;
  dateFrom: DateTime;
  dateUntil: DateTime;
  periodFormer: number;
  enjoyed: number;
  refund: number;
  available: number;
  days?: number;
  periodClosed: boolean;
  vacationDay:IVacationDay[]
}

export interface IVacationFilters {
  workerId: number;
  period?: number;
  page: number;
  perPage: number;
}

export interface IVacationSearchParams{
  workerId: number;
  period: number;
}