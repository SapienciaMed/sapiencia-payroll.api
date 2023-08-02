import { DateTime } from "luxon";
import { IWorker } from "./WorkerInterfaces";

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

export interface IEmploymentWorker extends IEmployment {
  worker: IWorker;
}

export interface IFilterEmployment {
  page: number;
  perPage: number;
  workerId: number;
}
