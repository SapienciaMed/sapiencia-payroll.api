import { DateTime } from "luxon";
import { IWorker } from "./WorkerInterfaces";
import { ITypesContracts } from "./TypesContractsInterfaces";
import { ICharge } from "./ChargeInterfaces";
import { ISalaryHistory } from "./SalaryHistoryInterfaces";
import { IDependence } from "./DependenceInterfaces";

export interface IEmployment {
  id?: number;
  workerId?: number;
  codDependence: number;
  idCharge: number;
  institutionalMail: string;
  idTypeContract: number;
  contractNumber: string;
  startDate: DateTime;
  endDate?: DateTime;
  specificObligations?: string;
  contractualObject?: string;
  state: string;
  idReasonRetirement?: number;
  retirementDate?: DateTime;
  settlementPaid?: boolean;
  totalValue?: number;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
  typesContracts?: ITypesContracts[];
  worker?: IWorker;
  charge?: ICharge;
  dependence?: IDependence;
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
  charges: ICharge[];
  salaryHistories: ISalaryHistory[];
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
  retirementDate?: DateTime;
  observation: string;
  idEmployment: number;
  state: string;
}
