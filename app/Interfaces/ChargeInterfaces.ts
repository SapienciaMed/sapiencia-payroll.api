import { DateTime } from "luxon";

export interface ICharge {
  id?: number;
  name?: string;
  codChargeType: number;
  observations?: string;
  baseSalary: number;
  state: boolean;
  userModify?: string;
  dateModified?: DateTime;
  userCreate?: string;
  dateCreate?: DateTime;
}

export interface IChargeFilters {
  id?: number;
  page: number;
  perPage: number;
}
