import { DateTime } from "luxon";

export interface IRelative {
  id: number;
  workerId: number;
  name: string;
  relationship: string;
  gender: string;
  birthDate: DateTime;
}
