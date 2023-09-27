import { DateTime } from "luxon";
import { IWorker } from "./WorkerInterfaces";
import { ITypesContracts } from "./TypesContractsInterfaces";
import { ICharge } from "./ChargeInterfaces";

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
  retirementDate?: DateTime;
  observation?: string;
  salary?: number;
  totalValue?: number;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
  typesContracts?: ITypesContracts[];
}

export interface IEmploymentResult {
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
  retirementDate?: DateTime;
  observation?: string;
  salary?: number;
  totalValue?: number;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
  typesContracts?: ITypesContracts[];
  worker: IWorker;
  charge?: ICharge;
}

export interface IEmploymentWorker extends IEmployment {
  worker: IWorker;
}

export interface IFilterEmployment {
  page: number;
  perPage: number;
  workerId: number;
}

export interface IReasonsForWithdrawal {
  id: number;
  name: string;
}

export interface IRetirementEmployment {
  idReasonRetirement: number;
  retirementDate: DateTime;
  observation: string;
  idEmployment: number;
  state: string;
}
