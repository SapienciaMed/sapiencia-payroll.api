import { DateTime } from "luxon";

export interface IcontractSuspension {
  id?: number;
  codEmployment: number;
  dateStart: DateTime;
  dateEnd: DateTime;
  adjustEndDate: boolean;
  newDateEnd: DateTime;
  observation?: string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}
