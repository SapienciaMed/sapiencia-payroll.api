import { DateTime } from "luxon";

export interface IFormPeriod {
    id?: number;
    idFormType: number;
    state: string;
    dateStart: DateTime;
    dateEnd: DateTime;
    cutoffDate: DateTime;
    paidDate: DateTime;
    month: number;
    year: number;
    userModified?: string;
    dateModified?: DateTime;
    userCreate?: string;
    dateCreate?: DateTime;
  }