import { DateTime } from "luxon";
import { IRelative } from "./RelativeInterfaces";
import { IEmployment } from "./EmploymentInterfaces";

export interface IWorker {
  id: number;
  typeDocument: string;
  numberDocument: string;
  firstName: string;
  secondSurname: string;
  gender: string;
  bloodType: string;
  nationality: string;
  email: string;
  contactNumber: string;
  department: string;
  municipality: string;
  neighborhood: string;
  addres: string;
  socioEconomic: string;
  severanceFund: string;
  riskLevel: string;
  housingType: string;
  userModified: string;
  dateModified: DateTime;
  userCreate: string;
  dateCreate: DateTime;
}

export interface ICreateWorker {
  worker: IWorker;
  relatives: IRelative[];
  employment: IEmployment;
}
