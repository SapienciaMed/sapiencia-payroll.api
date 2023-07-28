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
  observation?: string;
  salary?: number;
  totalValue?: number;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IFilterEmployment {
  page: number;
  perPage: number;
  workerId: number;
}
