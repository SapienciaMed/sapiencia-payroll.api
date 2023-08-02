import { DateTime } from "luxon";
import { IEmploymentWorker } from "./EmploymentInterfaces";
import { IIncapacityTypes } from "./TypesIncapacityInterface";

export interface IIncapacity {
  id?: number;
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

export interface IGetIncapacity extends IIncapacity {
  employment?: IEmploymentWorker;
  typeIncapacity: IIncapacityTypes | null;
}

export interface IFilterIncapacity {
  page: number;
  perPage: number;
  workerId?: number;
}
