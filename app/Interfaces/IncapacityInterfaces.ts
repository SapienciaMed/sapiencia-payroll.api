import { DateTime } from "luxon";
import { IEmployment }      from "./EmploymentInterfaces";
import { IWorker }          from "./WorkerInterfaces";
import { IIncapacityTypes } from './TypesIncapacityInterface';

export interface IIncapacity {

  id? : number;
  codIncapacityType: number;
  codEmployment: number;
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

export interface IGetIncapacityList {
  incapacity: IIncapacity | null;
  worker: IWorker | null;
  employment: IEmployment | null;
  typeIncapacity: IIncapacityTypes | null;
}

export interface IFilterIncapacity {
  page: number;
  perPage: number;
  idEmployee?: number;
}
