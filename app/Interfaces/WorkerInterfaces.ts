import { DateTime } from "luxon";

export interface IWorker {
  id?: number;
  typeDocument: string;
  numberDocument: string;
  firstName: string;
  secondName?: string;
  surname: string;
  secondSurname?: string;
  gender: string;
  bloodType: string;
  birthDate: DateTime;
  nationality: string;
  email?: string;
  contactNumber: string;
  department: string;
  municipality: string;
  neighborhood: string;
  address: string;
  socioEconomic?: string;
  eps?: string;
  severanceFund?: string;
  arl?: string;
  riskLevel?: string;
  housingType?: string;
  fundPension?: string;
  bank?: string;
  accountBankType?: string;
  accountBankNumber?: string;
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IWorkerFilters {
  documentList?: string[]
}