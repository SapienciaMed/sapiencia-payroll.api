import { DateTime } from "luxon";
import { ILicenceType } from "./LicenceTypesInterface";

export interface ILicence {
  id?: number;
  codEmployment: number;
  idLicenceType?: number;
  dateStart: DateTime;
  dateEnd: DateTime;
  licenceState: string;
  resolutionNumber:string;
  observation?: string;
}

export interface ILicenceFilters {
  codEmployment?: number;
  licenceState?: string;
  idLicenceType?: number;
  page: number;
  perPage: number;
}

export interface ILicenceResult {
  id?: number;
  codEmployment: number;
  idLicenceType?: number;
  dateStart: DateTime;
  dateEnd: DateTime;
  licenceState: string;
  resolutionNumber:string;
  observation?: string;
  licenceType: ILicenceType;
}