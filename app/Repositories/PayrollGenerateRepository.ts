import { IBooking } from "App/Interfaces/BookingInterfaces";
import { IDeduction } from "App/Interfaces/DeductionsInterfaces";
import { IEmploymentResult } from "App/Interfaces/EmploymentInterfaces";
import { IGrouper } from "App/Interfaces/GrouperInterfaces";
import { IHistoricalPayroll } from "App/Interfaces/HistoricalPayrollInterfaces";
import { IGetIncapacity } from "App/Interfaces/IncapacityInterfaces";
import { IIncome } from "App/Interfaces/IncomeInterfaces";
import { IIncomeType } from "App/Interfaces/IncomeTypesInterfaces";
import { ILicenceResult } from "App/Interfaces/LicenceInterfaces";
import { IManualDeduction } from "App/Interfaces/ManualDeductionsInterfaces";
import { IVacationResult } from "App/Interfaces/VacationsInterfaces";
import Booking from "App/Models/Booking";
import Deduction from "App/Models/Deduction";
import Employment from "App/Models/Employment";
import Grouper from "App/Models/Grouper";
import HistoricalPayroll from "App/Models/HistoricalPayroll";
import Incapacity from "App/Models/Incapacity";
import Income from "App/Models/Income";
import IncomeType from "App/Models/IncomeType";
import Licence from "App/Models/Licence";
import ManualDeduction from "App/Models/ManualDeduction";
import Vacation from "App/Models/Vacation";
import { DateTime } from "luxon";

export interface IPayrollGenerateRepository {
  getActiveEmploments(dateStart: Date): Promise<IEmploymentResult[]>;
  getByIdGrouper(id: number): Promise<IGrouper>;
  getMonthlyValuePerGrouper(
    gruperId: number,
    month: number,
    year: number,
    employmentId: number
  ): Promise<number>;
  getLicencesPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<ILicenceResult[]>;
  getIncapacitiesPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<IGetIncapacity[]>;
  getVacationsPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<IVacationResult[]>;
  getEventualDeductionsByEmployment(
    idEmployement: number,
    codPayroll: number
  ): Promise<IManualDeduction[]>;
  getCyclicDeductionsByEmployment(
    idEmployement: number
  ): Promise<IManualDeduction[]>;
  getIncomesTypesByName(name: string): Promise<IIncomeType>;
  createIncome(income: IIncome): Promise<IIncome>;
  deleteIncomes(codPayroll: number): Promise<IIncome[] | null>;
  deleteDeductions(codPayroll: number): Promise<IDeduction[] | null>;
  deleteReserves(codPayroll: number): Promise<IBooking[] | null>;
  deleteHistoryPayroll(
    codPayroll: number
  ): Promise<IHistoricalPayroll[] | null>;
}
export default class PayrollGenerateRepository
  implements IPayrollGenerateRepository
{
  constructor() {}

  async getMonthlyValuePerGrouper(
    gruperId: number,
    month: number,
    year: number,
    employmentId: number
  ): Promise<number> {
    const incomes = await Income.query()
      .select("ING_VALOR as value", "IAG_SIGNO as sign")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "ING_CODPPL_PLANILLA")
      .join(
        "IAG_INGRESOS_AGRUPADOR",
        "IAG_CODTIG_TIPO_INGRESO",
        "ING_CODTIG_TIPO_INGRESO"
      )
      .where("PPL_MES", month)
      .where("PPL_ANIO", year)
      .where("IAG_CODAGR_AGRUPADOR", gruperId)
      .where("ING_CODEMP_EMPLEO", employmentId);

    const toReturn = incomes.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    return toReturn;
  }

  async getActiveEmploments(dateStart: Date): Promise<IEmploymentResult[]> {
    const res = await Employment.query()
      .preload("worker")
      .preload("charges")
      .whereHas("typesContracts", (contractsQuery) => {
        contractsQuery.where("temporary", false);
      })
      .where("startDate", "<=", dateStart)
      .andWhere("state", "=", true);

    return res.map((i) => i.serialize() as IEmploymentResult);
  }

  async getByIdGrouper(id: number): Promise<IGrouper> {
    const res = await Grouper.findByOrFail("id", id);

    return res.serialize() as IGrouper;
  }

  async getLicencesPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<ILicenceResult[]> {
    const res = await Licence.query()
      .where("codEmployment", idEmployement)
      .whereBetween("dateStart", [dateStart.toString(), dateEnd.toString()])
      .whereBetween("dateEnd", [dateStart.toString(), dateEnd.toString()]);
    return res.map((i) => i.serialize() as ILicenceResult);
  }
  async getIncapacitiesPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<IGetIncapacity[]> {
    const res = await Incapacity.query()
      .where("codEmployment", idEmployement)
      .whereBetween("dateInitial", [dateStart.toString(), dateEnd.toString()])
      .whereBetween("dateFinish", [dateStart.toString(), dateEnd.toString()]);
    return res.map((i) => i.serialize() as IGetIncapacity);
  }

  async getVacationsPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<IVacationResult[]> {
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
    return res.map((i) => i.serialize() as IVacationResult);
  }

  async getEventualDeductionsByEmployment(
    idEmployement: number,
    codPayroll: number
  ): Promise<IManualDeduction[]> {
    const res = await ManualDeduction.query()
      .where("codEmployment", idEmployement)
      .andWhere("codFormsPeriod", codPayroll)
      .andWhere("cyclic", false);
    return res.map((i) => i.serialize() as IManualDeduction);
  }

  async getCyclicDeductionsByEmployment(
    idEmployement: number
  ): Promise<IManualDeduction[]> {
    const res = await ManualDeduction.query()
      .where("codEmployment", idEmployement)
      .andWhere("state", "Vigente")
      .andWhere("cyclic", true);
    return res.map((i) => i.serialize() as IManualDeduction);
  }

  async getIncomesTypesByName(name: string): Promise<IIncomeType> {
    const res = await IncomeType.query().where("name", name).first();

    return res?.serialize() as IIncomeType;
  }

  async createIncome(income: IIncome): Promise<IIncome> {
    const toCreate = new Income();

    toCreate.fill({ ...income });
    await toCreate.save();
    return toCreate.serialize() as IIncome;
  }

  async deleteIncomes(codPayroll: number): Promise<IIncome[] | null> {
    const res = await Income.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    return res.map((i) => i.serialize() as IIncome) || null;
  }

  async deleteDeductions(codPayroll: number): Promise<IDeduction[] | null> {
    const res = await Deduction.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    if (!res) {
      return null;
    }
    return res.map((i) => i.serialize() as IDeduction);
  }

  async deleteReserves(codPayroll: number): Promise<IBooking[] | null> {
    const res = await Booking.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    if (!res) {
      return null;
    }
    return res.map((i) => i.serialize() as IBooking);
  }

  async deleteHistoryPayroll(
    codPayroll: number
  ): Promise<IHistoricalPayroll[] | null> {
    const res = await HistoricalPayroll.query()
      .where("idTypePayroll", codPayroll)
      .delete();

    if (!res) {
      return null;
    }
    return res.map((i) => i.serialize() as IHistoricalPayroll);
  }
}
