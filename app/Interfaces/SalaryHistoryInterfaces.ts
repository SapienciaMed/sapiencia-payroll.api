import { DateTime } from "luxon";

export interface ISalaryHistory {
  id?: number;
  codEmployment: number;
  codIncrement: number;
  previousSalary?: number;
  salary: number;
  validity: boolean;
  effectiveDate: DateTime;
}

