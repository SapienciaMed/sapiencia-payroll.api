import { DateTime } from "luxon";

export interface IVacationDay {
  id?: number;
  codVacation: number;
  dateFrom: DateTime;
  dateUntil?: DateTime;
  enjoyedDays: number;
  paid: boolean;
  codForm?: number;
  observation?: string;
  refundType?: string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IVacationDayValidator {
  vacationDay: IVacationDay[];
  periodId: number;
  enjoyedDays: number;
  avaibleDays: number;
  refundDays?: number;
  formedDays?: number;
}

export interface IEditVacation {
  id: number;
  idVacationDay: number;
  dateFrom: DateTime;
  dateUntil: DateTime;
  observation?: string;
  available: number;
  refundTypes: string;
  refund: number;
  enjoyed: number;
}
