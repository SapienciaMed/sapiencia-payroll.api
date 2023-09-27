import { IBooking } from "App/Interfaces/BookingInterfaces";
import { IDeduction } from "App/Interfaces/DeductionsInterfaces";
import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import { IEmploymentResult } from "App/Interfaces/EmploymentInterfaces";
import { IGrouper } from "App/Interfaces/GrouperInterfaces";
import { IHistoricalPayroll } from "App/Interfaces/HistoricalPayrollInterfaces";
import { IGetIncapacity } from "App/Interfaces/IncapacityInterfaces";
import { IIncome } from "App/Interfaces/IncomeInterfaces";
import { IIncomeType } from "App/Interfaces/IncomeTypesInterfaces";
import { ILicenceResult } from "App/Interfaces/LicenceInterfaces";
import { IManualDeduction } from "App/Interfaces/ManualDeductionsInterfaces";
import { IRange } from "App/Interfaces/RangeInterfaces";
import { ISalaryHistory } from "App/Interfaces/SalaryHistoryInterfaces";
import { IVacationResult } from "App/Interfaces/VacationsInterfaces";
import Booking from "App/Models/Booking";
import Deduction from "App/Models/Deduction";
import DeductionType from "App/Models/DeductionType";
import Employment from "App/Models/Employment";
import Grouper from "App/Models/Grouper";
import HistoricalPayroll from "App/Models/HistoricalPayroll";
import Incapacity from "App/Models/Incapacity";
import Income from "App/Models/Income";
import IncomeType from "App/Models/IncomeType";
import Licence from "App/Models/Licence";
import ManualDeduction from "App/Models/ManualDeduction";
import Range from "App/Models/Range";
import SalaryHistory from "App/Models/SalaryHistory";
import Vacation from "App/Models/Vacation";
import { DateTime } from "luxon";

export interface IPayrollGenerateRepository {
  getRangeByGrouper(grouper: string): Promise<IRange[]>;
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
  getSalarybyEmployment(idEmployement: number): Promise<ISalaryHistory>;
  getIncomesTypesByName(name: string): Promise<IIncomeType>;
  getDeductionTypesByName(name: string): Promise<IDeductionType>;
  createIncome(income: IIncome): Promise<IIncome>;
  createDeduction(deduction: IDeduction): Promise<IDeduction>;
  createManyDeduction(deductions: IDeduction[]): Promise<IDeduction[]>;
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

  async getRangeByGrouper(grouper: string): Promise<IRange[]> {
    const res = await Range.query().where("grouper", grouper);
    return res.map((i) => i.serialize() as IRange);
  }

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

    const totalIncomes = incomes.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    const deductions = await Deduction.query()
      .select("DED_VALOR as value", "DAG_SIGNO as sign")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "DED_CODPPL_PLANILLA")
      .join(
        "DAG_DEDUCCIONES_AGRUPADOR",
        "DAG_CODTDD_TIPO_DEDUCCION",
        "DED_CODTDD_TIPO_DEDUCCION"
      )
      .where("PPL_MES", month)
      .where("PPL_ANIO", year)
      .where("DAG_CODAGR_AGRUPADOR", gruperId)
      .where("DED_CODEMP_EMPLEO", employmentId);

    const totalDeductions = deductions.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    return (totalIncomes || 0) - (totalDeductions || 0);
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

  async getSalarybyEmployment(idEmployement: number): Promise<ISalaryHistory> {
    const res = await SalaryHistory.query()
      .where("codEmployment", idEmployement)
      .andWhere("validity", true)
      .first();

    return res?.serialize() as ISalaryHistory;
  }

  async getIncomesTypesByName(name: string): Promise<IIncomeType> {
    const res = await IncomeType.query().where("name", name).first();

    return res?.serialize() as IIncomeType;
  }
  async getDeductionTypesByName(name: string): Promise<IDeductionType> {
    const res = await DeductionType.query().where("name", name).first();

    return res?.serialize() as IDeductionType;
  }

  async createIncome(income: IIncome): Promise<IIncome> {
    const toCreate = new Income();

    toCreate.fill({ ...income });
    await toCreate.save();
    return toCreate.serialize() as IIncome;
  }

  async createDeduction(deduction: IDeduction): Promise<IDeduction> {
    const toCreate = new Deduction();

    toCreate.fill({ ...deduction });
    await toCreate.save();
    return toCreate.serialize() as IDeduction;
  }

  async createManyDeduction(deductions: IDeduction[]): Promise<IDeduction[]> {
    const toCreate = await Deduction.createMany(deductions);

    return toCreate.map((i) => i.serialize() as IDeduction);
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
