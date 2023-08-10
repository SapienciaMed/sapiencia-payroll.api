import { DateTime } from "luxon";

export interface ILicence {
  id?: number;
  codEmployment: number;
  idLicenceType?: number;
  dateStart: DateTime;
  dateEnd: DateTime;
  licenceState: string;
  observation?: string;
}
