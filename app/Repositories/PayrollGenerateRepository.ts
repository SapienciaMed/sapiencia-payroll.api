import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import { IGrouper } from "App/Interfaces/GrouperInterfaces";
import { IIncapacity } from "App/Interfaces/IncapacityInterfaces";
import { ILicence } from "App/Interfaces/LicenceInterfaces";
import { IVacation } from "App/Interfaces/VacationsInterfaces";
import Booking from "App/Models/Booking";
import Deduction from "App/Models/Deduction";
import Employment from "App/Models/Employment";
import Grouper from "App/Models/Grouper";
import Incapacity from "App/Models/Incapacity";
import Income from "App/Models/Income";
import Licence from "App/Models/Licence";
import ManualDeduction from "App/Models/ManualDeduction";
import Vacation from "App/Models/Vacation";
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
      .whereBetween("dateEnd", [dateStart.toString(), dateEnd.toString()]);
    return res.map((i) => i.serialize() as ILicence);
  }
  async getIncapacitiesPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ) {
    const res = await Incapacity.query()
      .where("codEmployment", idEmployement)
      .whereBetween("dateInitial", [dateStart.toString(), dateEnd.toString()])
      .whereBetween("dateFinish", [dateStart.toString(), dateEnd.toString()]);
    return res.map((i) => i.serialize() as IIncapacity);
  }

  async getVacationsPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ) {
    const res = await Vacation.query()
      .where("codEmployment", idEmployement)
      .whereHas("vacationDay", (vacationDayQuery) => {
        vacationDayQuery
          .whereBetween("dateFrom", [dateStart.toString(), dateEnd.toString()])
          .whereBetween("dateUntil", [
            dateStart.toString(),
            dateEnd.toString(),
          ]);
      })
      .preload("vacationDay", (vacationDayQuery) => {
        vacationDayQuery
          .whereBetween("dateFrom", [dateStart.toString(), dateEnd.toString()])
          .whereBetween("dateUntil", [
            dateStart.toString(),
            dateEnd.toString(),
          ]);
      });
    return res.map((i) => i.serialize() as IVacation);
  }

  async getEventualDeductionsByEmployment(
    idEmployement: number,
    codPayroll: number
  ) {
    const res = await ManualDeduction.query()
      .where("codEmployment", idEmployement)
      .andWhere("codFormsPeriod", codPayroll)
      .andWhere("cyclic", false);
    return res.map((i) => i.serialize() as ManualDeduction);
  }

  async getCyclicDeductionsByEmployment(idEmployement: number) {
    const res = await ManualDeduction.query()
      .where("codEmployment", idEmployement)
      .andWhere("state", "Vigente")
      .andWhere("cyclic", true);
    return res.map((i) => i.serialize() as ManualDeduction);
  }

  async deleteIncomes(codPayroll: number) {
    const res = await Income.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    return res.map((i) => i.serialize() as Income);
  }

  async deleteDeductions(codPayroll: number) {
    const res = await Deduction.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    return res.map((i) => i.serialize() as Deduction);
  }

  async deleteReserves(codPayroll: number) {
    const res = await Booking.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    return res.map((i) => i.serialize() as Booking);
  }
}
