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

}
