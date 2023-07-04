import { DateTime } from "luxon";

export interface IJob {
  id: number;
  codWorker: number;
  codCharge: number;
  contractNumber: string;
  startDate: DateTime;
  endDate: DateTime;
  state: string;
  codReasonRetirement: number;
  userModified: string;
  dateModified: DateTime;
  userCreate: string;
  dateCreate: DateTime;
}
