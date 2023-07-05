import { DateTime } from "luxon";

export interface IEmployment {
  id?: number;
  workerId?: number;
  idCharge: number;
  contractNumber: string;
  startDate: DateTime;
  endDate: DateTime;
  state: string;
  idReasonRetirement: number;
  userModified: string;
  dateModified?: DateTime;
  userCreate: string;
  dateCreate?: DateTime;
}
