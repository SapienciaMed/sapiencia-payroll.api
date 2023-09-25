import { DateTime } from "luxon";

export interface IIncapcityDaysProcessed {
  id: number;
  codIncapcity: number;
  codFormPeriod: number;
  startDate: DateTime;
  endDate: DateTime;
  days: number;
}
