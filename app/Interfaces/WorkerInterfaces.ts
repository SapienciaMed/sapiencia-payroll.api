import { DateTime } from "luxon";
import { IRelative } from "./RelativeInterfaces";
import { IEmployment } from "./EmploymentInterfaces";

export interface IWorker {
  id?: number;
  typeDocument: string;
  numberDocument: string;
  firstName: string;
  secondName?: string;
  surName: string;
  secondSurname?: string;
  gender: string;
  bloodType: string;
  birthDate: Date;
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
  userModified?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface ICreateWorker {
  worker: IWorker;
  relatives: IRelative[];
  employment: IEmployment;
}
