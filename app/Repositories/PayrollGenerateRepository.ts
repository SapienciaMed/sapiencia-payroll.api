import * as XLSX from "xlsx";
import { IBooking } from "App/Interfaces/BookingInterfaces";
import { IcontractSuspension } from "App/Interfaces/ContractSuspensionInterfaces";
import { ICyclicalDeductionInstallment } from "App/Interfaces/CyclicalDeductionInstallmentInterface";
import { IDeduction } from "App/Interfaces/DeductionsInterfaces";
import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import {
  IEmployment,
  IEmploymentResult,
} from "App/Interfaces/EmploymentInterfaces";
import { IGrouper } from "App/Interfaces/GrouperInterfaces";
import { IHistoricalPayroll } from "App/Interfaces/HistoricalPayrollInterfaces";
import {
  IGetIncapacity,
  IIncapacity,
} from "App/Interfaces/IncapacityInterfaces";
import { IIncapcityDaysProcessed } from "App/Interfaces/IncapcityDaysProcessedInterfaces";
import { IIncome, IIncomePayroll } from "App/Interfaces/IncomeInterfaces";
import { IIncomeType } from "App/Interfaces/IncomeTypesInterfaces";
import { ILicence, ILicenceResult } from "App/Interfaces/LicenceInterfaces";
import {
  IManualCiclicalDeduction,
  IManualDeduction,
} from "App/Interfaces/ManualDeductionsInterfaces";
import { IRange } from "App/Interfaces/RangeInterfaces";
import { IRelative } from "App/Interfaces/RelativeInterfaces";
import { ISalaryHistory } from "App/Interfaces/SalaryHistoryInterfaces";
import { IVacation, IVacationResult } from "App/Interfaces/VacationsInterfaces";
import Booking from "App/Models/Booking";
import ContractSuspension from "App/Models/ContractSuspension";
import CyclicalDeductionInstallment from "App/Models/CyclicalDeductionInstallment";
import Deduction from "App/Models/Deduction";
import DeductionType from "App/Models/DeductionType";
import Employment from "App/Models/Employment";
import Grouper from "App/Models/Grouper";
import HistoricalPayroll from "App/Models/HistoricalPayroll";
import Incapacity from "App/Models/Incapacity";
import IncapacityDaysProcessed from "App/Models/IncapacityDaysProcessed";
import Income from "App/Models/Income";
import IncomeType from "App/Models/IncomeType";
import Licence from "App/Models/Licence";
import ManualDeduction from "App/Models/ManualDeduction";
import Range from "App/Models/Range";
import Relative from "App/Models/Relative";
import SalaryHistory from "App/Models/SalaryHistory";
import Vacation from "App/Models/Vacation";
import { DateTime } from "luxon";
import FormsPeriod from "App/Models/FormsPeriod";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import { IReserveType } from "App/Interfaces/ReserveTypesInterfaces";
import ReserveType from "App/Models/ReserveType";
import OtherIncome from "App/Models/OtherIncome";
import { EStatesOtherIncome } from "App/Constants/OtherIncome.enum";
import TaxDeductible from "App/Models/TaxDeductible";
import { EStatesTaxDeduction } from "App/Constants/TaxDeduction.enum";
import { EDeductionTypes, EGroupers } from "App/Constants/PayrollGenerateEnum";
import VacationDay from "App/Models/VacationDay";
import { IVacationDay } from "App/Interfaces/VacationDaysInterface";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";

export interface IPayrollGenerateRepository {
  getRangeByGrouper(grouper: string): Promise<IRange[]>;
  getActiveEmployments(dateStart: Date): Promise<IEmploymentResult[]>;
  getActiveEmploymentsContracts(dateStart: Date): Promise<IEmploymentResult[]>;
  getRetiredEmployments(dateStart: Date): Promise<IEmploymentResult[]>;
  getByIdGrouper(id: number): Promise<IGrouper>;
  getMonthlyValuePerGrouper(
    gruperId: number,
    month: number,
    year: number,
    employmentId: number,
    ISR: boolean,
    payrollPeriodId?: number
  ): Promise<number>;
  getSubTotalTwo(
    rentWorkerExempt: number,
    employmentId: number,
    month: number,
    year: number,
    payrollPeriodId?: number
  ): Promise<number>;
  getSubTotalThree(
    uvtValue: number,
    employmentId: number,
    month: number,
    year: number,
    payrollPeriodId?: number
  ): Promise<number>;
  getSubTotalFive(
    sub4: number,
    employmentId: number,
    month: number,
    year: number,
    payrollPeriodId?: number
  ): Promise<number>;
  getTotalIncomeForMonthPerGrouper(
    gruperId: number,
    month: number,
    year: number,
    employmentId: number,
    payrollPeriodId?: number
  ): Promise<number>;
  getValueRentExempt(
    gruperId: number,
    year: number,
    employmentId: number,
    month?: number,
    payrollPeriodId?: number
  ): Promise<number>;
  getLicencesPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<ILicenceResult[]>;
  getSuspensionPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<IcontractSuspension[]>;
  getIncapacitiesPeriodByEmployment(
    idEmployement: number,
    dateEnd: DateTime
  ): Promise<IGetIncapacity[]>;
  getVacationsPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<IVacationResult[]>;
  getVacationsPendingByEmployment(idEmployement: number): Promise<IVacation[]>;
  getEventualDeductionsByEmployment(
    idEmployement: number,
    codPayroll?: number
  ): Promise<IManualDeduction[]>;
  getCyclicDeductionsByEmployment(
    idEmployement: number
  ): Promise<IManualCiclicalDeduction[]>;
  getSalarybyEmployment(idEmployement: number): Promise<ISalaryHistory>;
  getIncomeByTypeAndEmployment(
    idEmployment: number,
    idTypeIncome: number
  ): Promise<IIncomePayroll[]>;
  getIncomesTypesByName(name: string): Promise<IIncomeType>;
  getDeductionTypesByName(name: string): Promise<IDeductionType>;
  getPayrollInformation(codPayroll: number): Promise<IFormPeriod | null>;
  createIncome(income: IIncome): Promise<IIncome>;
  createManyIncome(income: IIncome[]): Promise<IIncome[]>;
  createDeduction(deduction: IDeduction): Promise<IDeduction>;
  createManyDeduction(deductions: IDeduction[]): Promise<IDeduction[]>;
  createCiclycalInstallmentDeduction(
    ciclycalInstallment: ICyclicalDeductionInstallment[]
  ): Promise<ICyclicalDeductionInstallment[]>;
  createCiclycalInstallment(
    ciclycalInstallment: ICyclicalDeductionInstallment
  ): Promise<ICyclicalDeductionInstallment>;
  createReserve(reserve: IBooking): Promise<IBooking>;
  createHistoricalPayroll(
    historicalPayroll: IHistoricalPayroll
  ): Promise<IHistoricalPayroll>;
  deleteIncomes(codPayroll: number): Promise<IIncome[] | null>;
  deleteDeductions(codPayroll: number): Promise<IDeduction[] | null>;
  deleteReserves(codPayroll: number): Promise<IBooking[] | null>;
  deleteHistoryPayroll(
    codPayroll: number
  ): Promise<IHistoricalPayroll[] | null>;
  deleteIncapacityProcessedDays(
    codPayroll: number
  ): Promise<IIncapcityDaysProcessed[] | null>;
  deleteCyclicalDeductionInstallment(
    codPayroll: number
  ): Promise<ICyclicalDeductionInstallment[] | null>;
  createIncapacityDaysProcessed(data: IIncapcityDaysProcessed): Promise<void>;
  getRelativesDependent(workerId: number): Promise<IRelative[]>;
  getLastIncomeType(
    codEmployment: number,
    typeIncome: number,
    codPayroll?: number
  ): Promise<IIncome>;
  generateXlsx(rows: any): Promise<any>;
  getIncomeTypeByType(type: string): Promise<IIncomeType[]>;
  getTotalValueISRLast(
    month: number,
    year: number,
    employmentId: number
  ): Promise<number>;
  // mover
  getAllIncomesTypes(): Promise<IIncomeType[]>;
  getAllDeductionsTypes(): Promise<IDeductionType[]>;
  getAllReservesTypes(): Promise<IReserveType[]>;
  updateStateManualDeduction(
    idPayroll: number,
    state: string,
    trx: TransactionClientContract
  ): Promise<IManualDeduction[]>;
  updateStateIncapacities(
    idPayroll: number,
    trx: TransactionClientContract
  ): Promise<IIncapacity[]>;
  updateStateLicences(
    dateStart: DateTime,
    dateEnd: DateTime,
    state: string,
    trx: TransactionClientContract
  ): Promise<ILicence[]>;
  updateStatePayroll(
    id: number,
    state: string,
    trx?: TransactionClientContract
  ): Promise<IFormPeriod>;
  updateVacationPayroll(
    ids: number[],
    payrollId: number
  ): Promise<IVacationDay[]>;
  updateStateLiquidationEmployment(
    codEmployment: number
  ): Promise<IEmployment | null>;
  validNumberNegative(value: number): number;
}
export default class PayrollGenerateRepository
  implements IPayrollGenerateRepository
{
  constructor() {}

  async createIncapacityDaysProcessed(
    data: IIncapcityDaysProcessed
  ): Promise<void> {
    const toCreate = new IncapacityDaysProcessed();

    toCreate.fill({ ...data });
    await toCreate.save();
  }

  async getRangeByGrouper(grouper: string): Promise<IRange[]> {
    const res = await Range.query().where("grouper", grouper).orderBy("start");
    return res.map((i) => i.serialize() as IRange);
  }

  async getMonthlyValuePerGrouper(
    gruperId: number,
    month: number,
    year: number,
    employmentId: number,
    ISR: boolean,
    payrollPeriodId?: number
  ): Promise<number> {
    const incomesq = Income.query()
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

    if (payrollPeriodId) {
      incomesq.where("PPL_CODIGO", payrollPeriodId);
    }

    const incomes = await incomesq;

    const totalIncomes = incomes.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    const deductionsq = Deduction.query()
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

    if (payrollPeriodId) {
      deductionsq.where("PPL_CODIGO", payrollPeriodId);
    }
    const deductions = await deductionsq;

    const totalDeductions = deductions.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    const otherIncome = OtherIncome.query()
      .select("OIN_VALOR as value", "IAG_SIGNO as sign")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "OIN_CODPPL_PLANILLA")
      .join(
        "IAG_INGRESOS_AGRUPADOR",
        "IAG_CODTIG_TIPO_INGRESO",
        "OIN_CODTIG_TIPO_INGRESO"
      )
      .where("PPL_MES", month)
      .where("PPL_ANIO", year)
      .where("IAG_CODAGR_AGRUPADOR", gruperId)
      .where("OIN_CODEMP_EMPLEO", employmentId)
      .where("OIN_ESTADO", EStatesOtherIncome.Pendiente);

    const otherIncomes = await otherIncome;

    const totalOtherIncomes = otherIncomes.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    const taxDeduction = TaxDeductible.query()
      .select("DER_VALOR as value")
      .where("DER_ANIO", year)
      .where("DER_CODEMP_EMPLEO", employmentId)
      .where("DER_ESTADO", EStatesTaxDeduction.Pendiente);

    const taxDeductions = await taxDeduction;

    const totalTaxDeduction = taxDeductions.reduce(
      (sum, i) => sum + Number(i.$extras.value),
      0
    );

    if (ISR) {
      return (
        (totalIncomes ?? 0) +
        (totalOtherIncomes ?? 0) -
        ((totalDeductions ?? 0) + (totalTaxDeduction ?? 0))
      );
    }
    return (
      (totalIncomes || 0) - (this.validNumberNegative(totalDeductions) || 0)
    );
  }

  async getSubTotalTwo(
    rentWorkerExempt: number,
    employmentId: number,
    month: number,
    year: number
    // payrollPeriodId?: number
  ): Promise<number> {
    const deductionsq = Deduction.query()
      .select("DED_VALOR as value", "DAG_SIGNO as sign")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "DED_CODPPL_PLANILLA")
      .join(
        "DAG_DEDUCCIONES_AGRUPADOR",
        "DAG_CODTDD_TIPO_DEDUCCION",
        "DED_CODTDD_TIPO_DEDUCCION"
      )
      .where("PPL_MES", month)
      .where("PPL_ANIO", year)
      .where("DAG_CODAGR_AGRUPADOR", EGroupers.grouperSub2)
      .where("DED_CODEMP_EMPLEO", employmentId);

    const deductions = await deductionsq;

    const totalDeductions = deductions.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    const taxDeduction = TaxDeductible.query()
      .select("DER_VALOR as value")
      .where("DER_ANIO", year)
      .where("DER_CODEMP_EMPLEO", employmentId)
      .where("DER_ESTADO", EStatesTaxDeduction.Pendiente);

    const taxDeductions = await taxDeduction;

    const totalTaxDeduction = taxDeductions.reduce(
      (sum, i) => sum + Number(i.$extras.value),
      0
    );

    const sub2 =
      (totalDeductions || 0) +
      (totalTaxDeduction || 0) +
      (rentWorkerExempt || 0);

    return Math.round(sub2);
  }

  async getSubTotalThree(
    uvtValue: number,
    employmentId: number,
    month: number,
    year: number
    // payrollPeriodId?: number
  ): Promise<number> {
    const deductionsq = Deduction.query()
      .select("DED_VALOR as value", "DAG_SIGNO as sign")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "DED_CODPPL_PLANILLA")
      .join(
        "DAG_DEDUCCIONES_AGRUPADOR",
        "DAG_CODTDD_TIPO_DEDUCCION",
        "DED_CODTDD_TIPO_DEDUCCION"
      )
      .where("PPL_MES", month)
      .where("PPL_ANIO", year)
      .where("DAG_CODAGR_AGRUPADOR", EGroupers.grouperSub3)
      .where("DED_CODEMP_EMPLEO", employmentId);

    const deductions = await deductionsq;

    const totalDeductions = deductions.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    const percent40 = (totalDeductions * 40) / 100;

    const uvt1340 = uvtValue * 1340;

    const sub3 = percent40 > uvt1340 ? uvt1340 : percent40;

    return Math.round(sub3);
  }

  async getSubTotalFive(
    sub4: number,
    employmentId: number,
    month: number,
    year: number
    // payrollPeriodId?: number
  ): Promise<number> {
    const incomesTotal = await this.getTotalIncomeForMonthPerGrouper(
      EGroupers.incomeTaxGrouper,
      month,
      year,
      employmentId
    );

    const deductionsq = Deduction.query()
      .select("DED_VALOR as value", "DAG_SIGNO as sign")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "DED_CODPPL_PLANILLA")
      .join(
        "DAG_DEDUCCIONES_AGRUPADOR",
        "DAG_CODTDD_TIPO_DEDUCCION",
        "DED_CODTDD_TIPO_DEDUCCION"
      )
      .where("PPL_MES", month)
      .where("PPL_ANIO", year)
      .where("DAG_CODAGR_AGRUPADOR", EGroupers.grouperSub3)
      .where("DED_CODEMP_EMPLEO", employmentId);

    const deductions = await deductionsq;

    const totalDeductions = deductions.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    const sub5 = incomesTotal - totalDeductions - sub4;

    return Math.round(sub5);
  }

  async getTotalIncomeForMonthPerGrouper(
    gruperId: number,
    month: number,
    year: number,
    employmentId: number,
    payrollPeriodId?: number
  ): Promise<number> {
    const incomesq = Income.query()
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

    if (payrollPeriodId) {
      incomesq.where("PPL_CODIGO", payrollPeriodId);
    }

    const incomes = await incomesq;

    const totalIncomes = incomes.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    const otherIncome = OtherIncome.query()
      .select("OIN_VALOR as value", "IAG_SIGNO as sign")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "OIN_CODPPL_PLANILLA")
      .join(
        "IAG_INGRESOS_AGRUPADOR",
        "IAG_CODTIG_TIPO_INGRESO",
        "OIN_CODTIG_TIPO_INGRESO"
      )
      .where("PPL_MES", month)
      .where("PPL_ANIO", year)
      .where("IAG_CODAGR_AGRUPADOR", gruperId)
      .where("OIN_CODEMP_EMPLEO", employmentId)
      .where("OIN_ESTADO", EStatesOtherIncome.Pendiente);

    const otherIncomes = await otherIncome;

    const totalOtherIncomes = otherIncomes.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    return (totalIncomes ?? 0) + (totalOtherIncomes ?? 0);
  }

  async getValueRentExempt(
    gruperId: number,
    year: number,
    employmentId: number,
    month?: number,
    payrollPeriodId?: number
  ): Promise<number> {
    const deductionsq = Deduction.query()
      .select("DED_VALOR as value", "DAG_SIGNO as sign")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "DED_CODPPL_PLANILLA")
      .join(
        "DAG_DEDUCCIONES_AGRUPADOR",
        "DAG_CODTDD_TIPO_DEDUCCION",
        "DED_CODTDD_TIPO_DEDUCCION"
      )
      .where("PPL_ANIO", year)
      .where("DAG_CODAGR_AGRUPADOR", gruperId)
      .where("DED_CODEMP_EMPLEO", employmentId);

    if (month) {
      deductionsq.where("PPL_MES", month);

      if (payrollPeriodId) {
        deductionsq.where("PPL_CODIGO", payrollPeriodId);
      }

      const deductions = await deductionsq;

      const totalDeductions = deductions.reduce(
        (sum, i) =>
          sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
        0
      );

      return totalDeductions;
    } else {
      const deductions = await deductionsq;

      const totalDeductions = deductions.reduce(
        (sum, i) =>
          sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
        0
      );

      return totalDeductions;
    }
  }

  async getActiveEmployments(dateStart: Date): Promise<IEmploymentResult[]> {
    const res = await Employment.query()
      .preload("worker")
      .preload("charges")
      .preload("salaryHistories", (query) => {
        query.andWhere("validity", true);
      })
      .whereHas("typesContracts", (contractsQuery) => {
        contractsQuery.where("temporary", false);
      })
      .where("startDate", "<=", dateStart)
      .andWhere("state", "=", true);

    return res.map((i) => i.serialize() as IEmploymentResult);
  }

  async getRetiredEmployments(dateStart: Date): Promise<IEmploymentResult[]> {
    const res = await Employment.query()
      .preload("worker")
      .preload("charges")
      .preload("salaryHistories", (query) => {
        query.andWhere("validity", true);
      })
      .whereHas("typesContracts", (contractsQuery) => {
        contractsQuery.where("temporary", false);
      })
      .where("startDate", "<=", dateStart)
      .andWhere("state", "=", false);

    return res.map((i) => i.serialize() as IEmploymentResult);
  }

  async getActiveEmploymentsContracts(
    dateStart: Date
  ): Promise<IEmploymentResult[]> {
    const res = await Employment.query()
      .preload("worker")
      .preload("charges")
      .preload("salaryHistories", (query) => {
        query.andWhere("validity", true);
      })
      .whereHas("typesContracts", (contractsQuery) => {
        contractsQuery.where("temporary", true);
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
      .preload("licenceType")
      .where("codEmployment", idEmployement)
      .whereBetween("dateStart", [dateStart.toString(), dateEnd.toString()])
      .whereBetween("dateEnd", [dateStart.toString(), dateEnd.toString()]);
    return res.map((i) => i.serialize() as ILicenceResult);
  }

  async getSuspensionPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<IcontractSuspension[]> {
    const res = await ContractSuspension.query()
      .where("codEmployment", idEmployement)
      .whereBetween("dateStart", [dateStart.toString(), dateEnd.toString()])
      .whereBetween("dateEnd", [dateStart.toString(), dateEnd.toString()]);
    return res.map((i) => i.serialize() as IcontractSuspension);
  }
  async getIncapacitiesPeriodByEmployment(
    idEmployement: number,
    dateEnd: DateTime
  ): Promise<IGetIncapacity[]> {
    const res = await Incapacity.query()
      .preload("daysProcessed")
      .preload("typeIncapacity")
      .where("codEmployment", idEmployement)
      .where("isComplete", false)
      .where("dateInitial", "<=", dateEnd.toString());

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

  async getVacationsPendingByEmployment(
    idEmployement: number
  ): Promise<IVacation[]> {
    const res = await Vacation.query()
      .where("codEmployment", idEmployement)
      .andWhere("available", ">", 0)
      .andWhere("periodClosed", false);

    return res.map((i) => i.serialize() as IVacation);
  }

  async getEventualDeductionsByEmployment(
    idEmployement: number,
    codPayroll?: number
  ): Promise<IManualDeduction[]> {
    const res = ManualDeduction.query().where("codEmployment", idEmployement);
    res.andWhere("cyclic", false);
    res.andWhere("state", "Vigente");
    if (codPayroll) {
      res.andWhere("codFormsPeriod", codPayroll);
    }
    const result = await res;
    return result.map((i) => i.serialize() as IManualDeduction);
  }

  async getCyclicDeductionsByEmployment(
    idEmployement: number
  ): Promise<IManualCiclicalDeduction[]> {
    const res = await ManualDeduction.query()
      .where("codEmployment", idEmployement)
      .andWhere("state", "Vigente")
      .andWhere("cyclic", true)
      .preload("installmentsDeduction");
    return res.map((i) => i.serialize() as IManualCiclicalDeduction);
  }

  async getSalarybyEmployment(idEmployement: number): Promise<ISalaryHistory> {
    const res = await SalaryHistory.query()
      .where("codEmployment", idEmployement)
      .andWhere("validity", true)
      .first();

    return res?.serialize() as ISalaryHistory;
  }

  async getIncomeByTypeAndEmployment(
    idEmployment: number,
    idTypeIncome: number
  ): Promise<IIncomePayroll[]> {
    const res = await Income.query()
      .where("idEmployment", idEmployment)
      .andWhere("idTypeIncome", idTypeIncome)
      .preload("formPeriod");
    return res.map((i) => i.serialize() as IIncomePayroll);
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

  async createManyIncome(incomes: IIncome[]): Promise<IIncome[]> {
    const toCreate = await Income.createMany(incomes);

    return toCreate.map((i) => i.serialize() as IIncome);
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

  async createCiclycalInstallment(
    ciclycalInstallment: ICyclicalDeductionInstallment
  ): Promise<ICyclicalDeductionInstallment> {
    const toCreate = new CyclicalDeductionInstallment();

    toCreate.fill({ ...ciclycalInstallment });
    await toCreate.save();
    return toCreate.serialize() as ICyclicalDeductionInstallment;
  }

  async createCiclycalInstallmentDeduction(
    ciclycalInstallment: ICyclicalDeductionInstallment[]
  ): Promise<ICyclicalDeductionInstallment[]> {
    const toCreate = await CyclicalDeductionInstallment.createMany(
      ciclycalInstallment
    );

    return toCreate.map((i) => i.serialize() as ICyclicalDeductionInstallment);
  }

  async createReserve(reserve: IBooking): Promise<IBooking> {
    const toCreate = new Booking();

    toCreate.fill({ ...reserve });
    await toCreate.save();
    return toCreate.serialize() as IBooking;
  }

  async createHistoricalPayroll(
    historicalPayroll: IHistoricalPayroll
  ): Promise<IHistoricalPayroll> {
    const toCreate = new HistoricalPayroll();

    toCreate.fill({ ...historicalPayroll });
    await toCreate.save();
    return toCreate.serialize() as IHistoricalPayroll;
  }
  async deleteIncomes(codPayroll: number): Promise<IIncome[] | null> {
    const res = await Income.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    return res || null;
  }

  async deleteDeductions(codPayroll: number): Promise<IDeduction[] | null> {
    const res = await Deduction.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    if (!res) {
      return null;
    }
    return res;
  }

  async deleteReserves(codPayroll: number): Promise<IBooking[] | null> {
    const res = await Booking.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    if (!res) {
      return null;
    }
    return res;
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
    return res;
  }

  async deleteIncapacityProcessedDays(
    codPayroll: number
  ): Promise<IIncapcityDaysProcessed[] | null> {
    const res = await IncapacityDaysProcessed.query()
      .where("codFormPeriod", codPayroll)
      .delete();

    if (!res) {
      return null;
    }
    return res;
  }

  async deleteCyclicalDeductionInstallment(
    codPayroll: number
  ): Promise<ICyclicalDeductionInstallment[] | null> {
    const res = await CyclicalDeductionInstallment.query()
      .where("idTypePayroll", codPayroll)
      .delete();
    if (!res) {
      return null;
    }
    return res;
  }

  async getRelativesDependent(workerId: number): Promise<IRelative[]> {
    const Relatives = await Relative.query()
      .where("workerId", workerId)
      .where("dependent", true);

    return Relatives.map((i) => i.serialize() as IRelative);
  }

  async getLastIncomeType(
    codEmployment: number,
    typeIncome: number,
    codPayroll?: number
  ): Promise<IIncome> {
    const lastIncome = Income.query().preload("formPeriod");
    lastIncome.where("ING_CODEMP_EMPLEO", codEmployment);
    lastIncome.where("ING_CODTIG_TIPO_INGRESO", typeIncome);
    if (codPayroll) {
      lastIncome.andWhere("idTypePayroll", "<>", codPayroll);
    }
    lastIncome.orderBy("ING_CODIGO", "desc");
    lastIncome.limit(1);
    const result = await lastIncome;
    if (result.length > 0) {
      return result[0].serialize() as IIncome;
    }

    return { value: 0 } as IIncome;
  }

  async getTotalValueISRLast(
    month: number,
    year: number,
    employmentId: number
  ): Promise<number> {
    const deductionsq = Deduction.query()
      .select("DED_VALOR as value")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "DED_CODPPL_PLANILLA")
      .where("PPL_MES", month)
      .where("PPL_ANIO", year)
      .where("DED_CODEMP_EMPLEO", employmentId)
      .where("DED_CODTDD_TIPO_DEDUCCION", EDeductionTypes.incomeTax);

    const deductions = await deductionsq;

    const totalDeductions = deductions.reduce(
      (sum, i) => sum + Number(i.$extras.value),
      0
    );

    return Math.round(totalDeductions);
  }

  async getPayrollInformation(codPayroll: number): Promise<IFormPeriod | null> {
    const res = await FormsPeriod.query()
      .preload("deductions")
      .preload("incomes")
      .preload("reserves")
      .preload("historicalPayroll", (subq) =>
        subq.preload("employment", (subq2) => subq2.preload("worker"))
      )
      .where("id", codPayroll)
      .first();

    if (!res) {
      return null;
    }

    return res.serialize() as IFormPeriod;
  }

  async generateXlsx(rows: any): Promise<any> {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    return buffer;
  }

  async getIncomeTypeByType(type: string): Promise<IIncomeType[]> {
    const typeIncomes = await IncomeType.query().where("type", type);

    console.log(IncomeType.query().where("type", type).toQuery());

    return typeIncomes.map((i) => i.serialize() as IncomeType);
  }
  //mover
  async getAllIncomesTypes(): Promise<IIncomeType[]> {
    const res = await IncomeType.query();
    return res.map((i) => i.serialize() as IIncomeType);
  }

  async getAllDeductionsTypes(): Promise<IDeductionType[]> {
    const res = await DeductionType.query();
    return res.map((i) => i.serialize() as IDeductionType);
  }

  async getAllReservesTypes(): Promise<IReserveType[]> {
    const res = await ReserveType.query();
    return res.map((i) => i.serialize() as IReserveType);
  }

  async updateStatePayroll(
    id: number,
    state: string,
    trx?: TransactionClientContract
  ): Promise<IFormPeriod> {
    const res = await FormsPeriod.findOrFail(id);
    if (trx) {
      (await res.merge({ state }).save()).useTransaction(trx);
    } else {
      await res.merge({ state }).save();
    }
    return res.serialize() as IFormPeriod;
  }

  async updateStateLicences(
    dateStart: DateTime,
    dateEnd: DateTime,
    state: string,
    trx: TransactionClientContract
  ): Promise<ILicence[]> {
    const licence = await Licence.query()
      .whereBetween("dateEnd", [dateStart.toString(), dateEnd.toString()])
      .update({ licenceState: state })
      .useTransaction(trx);
    if (licence.length == 0) {
      return [];
    }
    return licence;
  }

  async updateVacationPayroll(
    ids: number[],
    payrollId: number
  ): Promise<IVacationDay[]> {
    const vacation = await VacationDay.query()
      .whereIn("codVacation", ids)
      .update({ codForm: payrollId });
    if (vacation.length == 0) {
      return [];
    }
    return vacation;
  }
  async updateStateIncapacities(
    idPayroll: number,
    trx: TransactionClientContract
  ): Promise<IIncapacity[]> {
    const incapacitiesProcess = await IncapacityDaysProcessed.query().where(
      "codFormPeriod",
      idPayroll
    );
    if (incapacitiesProcess.length <= 0) {
      return [];
    }
    const idIncapacity = incapacitiesProcess.map(
      (incapacity) => incapacity.codFormPeriod
    );
    const res = await Incapacity.query()
      .whereIn("id", idIncapacity)
      .update("isComplete", true)
      .useTransaction(trx);
    return res;
  }

  async updateStateLiquidationEmployment(
    codEmployment: number
  ): Promise<IEmployment | null> {
    const res = await Employment.find(codEmployment);
    if (!res) {
      return null;
    }
    res?.merge({ settlementPaid: true });
    res?.save();
    return res;
  }

  async updateStateManualDeduction(
    idPayroll: number,
    state: string,
    trx: TransactionClientContract
  ): Promise<IManualDeduction[]> {
    const eventualDeduction = await ManualDeduction.query()
      .where("cyclic", false)
      .andWhere("codFormsPeriod", idPayroll)
      .update({ state })
      .useTransaction(trx);

    const ciclycalDeductionInstallment =
      await CyclicalDeductionInstallment.query().where(
        "idTypePayroll",
        idPayroll
      );
    if (ciclycalDeductionInstallment.length > 0) {
      ciclycalDeductionInstallment.map(async (deduction) => {
        const ciclycalDeduction = await ManualDeduction.findOrFail(
          deduction.idDeductionManual
        );
        if (
          ciclycalDeduction.numberInstallments == deduction.quotaNumber &&
          !ciclycalDeduction.porcentualValue
        ) {
          (await ciclycalDeduction.merge({ state }).save()).useTransaction(trx);
        }
      });
      eventualDeduction.push(ciclycalDeductionInstallment);
    }
    if (
      eventualDeduction.length == 0 &&
      ciclycalDeductionInstallment.length == 0
    ) {
      return [];
    }
    return eventualDeduction;
  }

  validNumberNegative(value: number): number {
    if (value < 0) {
      return 0;
    } else {
      return value;
    }
  }
}
