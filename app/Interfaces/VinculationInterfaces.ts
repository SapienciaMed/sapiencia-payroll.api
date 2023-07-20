import { IEmployment } from "./EmploymentInterfaces";
import { IRelatives } from "./RelativeInterfaces";
import { IWorker } from "./WorkerInterfaces";

export interface ICreateOrUpdateVinculation {
  worker: IWorker;
  relatives: IRelatives[];
  employment: IEmployment;
}

export interface IGetByVinculation {
  worker: IWorker;
  relatives: IRelatives[] | null;
  employment: IEmployment | null;
}
export interface IGetVinculation {
  worker: IWorker;
  employment: IEmployment;
}

export interface IFilterVinculation {
  page: number;
  perPage: number;
  documentNumber?: number;
  state?: string;
  vinculationType?: string;
  name?: string;
  lastName?: string;
}
