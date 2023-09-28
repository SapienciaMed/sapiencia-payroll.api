import { DateTime } from "luxon";
import { IEmploymentWorker } from "./EmploymentInterfaces";
import { IIncapacityTypes } from "./TypesIncapacityInterface";
import { IIncapcityDaysProcessed } from "./IncapcityDaysProcessedInterfaces";

export interface IIncapacity {
  id?: number;
  codIncapacityType: number;
  codEmployment: number;
  dateInitial: DateTime;
  dateFinish: DateTime;
  comments?: string;
  isExtension?: boolean;
  isComplete: boolean;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
  daysProcessed?: IIncapcityDaysProcessed[];
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
