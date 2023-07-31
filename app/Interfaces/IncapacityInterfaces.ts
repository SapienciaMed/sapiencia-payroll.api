import { DateTime } from "luxon";
import { IEmployment } from "./EmploymentInterfaces";
import { IWorker } from "./WorkerInterfaces";

export interface IIncapacity {

  id? : number;
  codIncapacityType: number;
  codEmployee: number;
  dateInitial: DateTime;
  dateFinish: DateTime;
  comments?: string;
  isExtension?: boolean;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;

}

export interface IGetIncapacity {
  worker: IWorker;
  employment: IEmployment;
}

export interface IFilterIncapacity {
  page: number;
  perPage: number;
  idEmployee?: number;
}
