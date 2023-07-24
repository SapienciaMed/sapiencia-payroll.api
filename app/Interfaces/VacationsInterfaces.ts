import { DateTime } from "luxon";

export interface IVacation { 
    id?: number;
    codEmployment: number;
    period: number;
    dateFrom?: DateTime;
    dateUntil?: DateTime;
    periodFormer: number;
    enjoyed: number;
    available: number;
    days: number;
    periodClosed: boolean;
}