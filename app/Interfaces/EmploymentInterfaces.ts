import { DateTime } from "luxon";

export interface IEmployment {
  id?: number;
  workerId?: number;
  idCharge: number;
  institutionalMail: string;
  contractNumber: string;
  startDate: DateTime;
  endDate?: DateTime;
  state: string;
  idTypeContract: number;
  idReasonRetirement?: number;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}
