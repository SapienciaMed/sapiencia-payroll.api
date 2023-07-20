import { DateTime } from "luxon";

export interface IRelatives {
  id?: number;
  workerId?: number;
  name: string;
  relationship: string;
  gender: string;
  birthDate: DateTime;
}
