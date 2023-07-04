import { DateTime } from "luxon";

export interface IRelative {
  id: number;
  codWorker: number;
  name: string;
  relationship: string;
  gender: string;
  birthDate: DateTime;
}
