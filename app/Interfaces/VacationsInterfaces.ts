import { DateTime } from "luxon";

export interface IVacation {
  id?: number;
  codEmployment: string;
  period: string;
  dateFrom: DateTime;
  dateUntil: DateTime;
  periodFormer: string;
  enjoyed: string;
  available: string;
  days: string;
  periodClosed: boolean;
}

export interface IVacationFilters {
  workerId: number;
  period?: string;
  page: number;
  perPage: number;
}
