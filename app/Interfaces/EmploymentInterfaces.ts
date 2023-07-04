import { DateTime } from "luxon";

export interface IEmployment {
  id: number;
  workerId: number;
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
