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
