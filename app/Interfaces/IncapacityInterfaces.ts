<<<<<<< HEAD
export interface IIncapacity {
  id?: number;
  employmentId: number;
}

export interface IIncapacityFilters {
  page: number;
  perPage: number;
  employmentId: number;
=======
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

>>>>>>> S3-NOM014
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
