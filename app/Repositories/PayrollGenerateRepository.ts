import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import { IGrouper } from "App/Interfaces/GrouperInterfaces";
import { ILicence } from "App/Interfaces/LicenceInterfaces";
import Employment from "App/Models/Employment";
import Grouper from "App/Models/Grouper";
import Incapacity from "App/Models/Incapacity";
import Licence from "App/Models/Licence";
import { DateTime } from "luxon";

export interface IPayrollGenerateRepository {
  getActiveEmploments(dateStart: Date): Promise<IEmployment[]>;
  getByIdGrouper(id: number): Promise<IGrouper>;
}
export default class PayrollGenerateRepository
  implements IPayrollGenerateRepository
{
  constructor() {}

  async getActiveEmploments(dateStart: Date): Promise<IEmployment[]> {
    const res = await Employment.query()
      .preload("worker")
      .preload("charges")
      .whereHas("typesContracts", (contractsQuery) => {
        contractsQuery.where("temporary", false);
      })
      .where("startDate", "<=", dateStart)
      .andWhere("state", "=", 1);

    return res.map((i) => i.serialize() as IEmployment);
  }

  async getByIdGrouper(id: number): Promise<IGrouper> {
    const res = await Grouper.findByOrFail("id", id);

    return res.serialize() as IGrouper;
  }

  async getLicencesPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ) {
    const res = await Licence.query()
      .where("codEmployment", idEmployement)
      .whereBetween("dateStart", [dateStart.toString(), dateEnd.toString()])
      .andWhereBetween("dateEnd", [dateStart.toString(), dateEnd.toString()]);
    return res.map((i) => i.serialize() as ILicence);
  }
  async getIncapacitiesPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ) {}

  async getVacationsPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ) {}

  async getEventualDeductionsByEmployment(
    idEmployement: number,
    codPayroll: number
  ) {}

  async getCyclicDeductionsByEmployment(
    idEmployement: number,
    codPayroll: number
  ) {}
}
