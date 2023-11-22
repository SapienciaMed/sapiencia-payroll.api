import { DateTime } from "luxon";
import { IRelative } from "./RelativeInterfaces";

export interface IWorker {
  id?: number;
  typeDocument: string;
  numberDocument: string;
  firstName: string;
  secondName?: string;
  surname: string;
  secondSurname?: string;
  birthDate: DateTime;
  gender: string;
  bloodType: string;
  nationality: string;
  email?: string;
  contactNumber: string;
  department: string;
  municipality: string;
  neighborhood: string;
  address: string;
  housingType?: string;
  socioEconomic?: string;
  fiscalIdentification?: string;
  eps?: string;
  severanceFund?: string;
  fundPension?: string;
  arl?: string;
  riskLevel?: string;
  bank?: string;
  accountBankType?: string;
  accountBankNumber?: string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
  relatives?: IRelative[];
}

export interface IWorkerFilters {
  documentList?: string[];
}
