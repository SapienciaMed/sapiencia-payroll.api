import * as XLSX from "xlsx";
import { IBooking } from "App/Interfaces/BookingInterfaces";
import { IcontractSuspension } from "App/Interfaces/ContractSuspensionInterfaces";
import { ICyclicalDeductionInstallment } from "App/Interfaces/CyclicalDeductionInstallmentInterface";
import { IDeduction } from "App/Interfaces/DeductionsInterfaces";
import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import { IEmploymentResult } from "App/Interfaces/EmploymentInterfaces";
import { IGrouper } from "App/Interfaces/GrouperInterfaces";
import { IHistoricalPayroll } from "App/Interfaces/HistoricalPayrollInterfaces";
import { IGetIncapacity } from "App/Interfaces/IncapacityInterfaces";
import { IIncapcityDaysProcessed } from "App/Interfaces/IncapcityDaysProcessedInterfaces";
import { IIncome, IIncomePayroll } from "App/Interfaces/IncomeInterfaces";
import { IIncomeType } from "App/Interfaces/IncomeTypesInterfaces";
import { ILicenceResult } from "App/Interfaces/LicenceInterfaces";
import {
  IManualCiclicalDeduction,
  IManualDeduction,
} from "App/Interfaces/ManualDeductionsInterfaces";
import { IRange } from "App/Interfaces/RangeInterfaces";
import { IRelative } from "App/Interfaces/RelativeInterfaces";
import { ISalaryHistory } from "App/Interfaces/SalaryHistoryInterfaces";
import { IVacationResult } from "App/Interfaces/VacationsInterfaces";
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

export interface IPayrollGenerateRepository {
  getRangeByGrouper(grouper: string): Promise<IRange[]>;
  getActiveEmployments(dateStart: Date): Promise<IEmploymentResult[]>;
  getActiveEmploymentsContracts(dateStart: Date): Promise<IEmploymentResult[]>;
  getByIdGrouper(id: number): Promise<IGrouper>;
  getMonthlyValuePerGrouper(
    gruperId: number,
    month: number,
    year: number,
    employmentId: number,
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
  getEventualDeductionsByEmployment(
    idEmployement: number,
    codPayroll: number
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
  getPayrollInformation(codPayroll: number): Promise<any>;
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
  getRelatives(workerId: number): Promise<IRelative[]>;
  getLastIncomeType(
    codEmployment: number,
    typeIncome: number
  ): Promise<IIncome>;
  generateXlsx(rows: any): Promise<any>;
  getIncomeTypeByType(type: string): Promise<IIncomeType[]>;
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

    return (totalIncomes || 0) - (totalDeductions || 0);
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

  async getRelatives(workerId: number): Promise<IRelative[]> {
    const Relatives = await Relative.query().where("workerId", workerId);

    return Relatives.map((i) => i.serialize() as IRelative);
  }

  async getLastIncomeType(
    codEmployment: number,
    typeIncome: number
  ): Promise<IIncome> {
    const lastIncome = await Income.query()
      .where("ING_CODEMP_EMPLEO", codEmployment)
      .where("ING_CODTIG_TIPO_INGRESO", typeIncome)
      .orderBy("ING_CODIGO", "desc")
      .limit(1);

    if (lastIncome.length > 0) {
      return lastIncome[0].serialize() as IIncome;
    }

    return { value: 0 } as IIncome;
  }

  async getPayrollInformation(codPayroll: number): Promise<any> {
    const payrollInfo: any = {};

    // Consulta para la información de empleo
    payrollInfo.employmentInfo = await FormsPeriod.query()
      .select(
        "TRA_TRABAJADORES.TRA_TIPO_DOCUMENTO as tipo_documento",
        "TRA_TRABAJADORES.TRA_NUMERO_DOCUMENTO as numero_documento",
        "TRA_TRABAJADORES.TRA_CODIGO_IDENTIFICACION_FISCAL as identificacion_fiscal",
        "TRA_TRABAJADORES.TRA_PRIMER_NOMBRE as primer_nombre",
        "TRA_TRABAJADORES.TRA_SEGUNDO_NOMBRE as segundo_nombre",
        "TRA_TRABAJADORES.TRA_PRIMER_APELLIDO as primer_apellido",
        "TRA_TRABAJADORES.TRA_SEGUNDO_APELLIDO as segundo_apellido",
        "TRA_TRABAJADORES.TRA_BANCO as banco",
        "TRA_TRABAJADORES.TRA_CUENTA_BANCARIA as nro_cuenta_bancaria",
        "DEP_DEPENDENCIAS.DEP_NOMBRE as dependencia",
        "EMP_EMPLEOS.EMP_NUMERO_CONTRATO",
        "TCO_TIPOS_CONTRATO.TCO_NOMBRE as tipo_contrato"
      )
      .join("HPL_HISTORICOS_PLANILLA", "HPL_CODPPL_PLANILLA", "PPL_CODIGO")
      .join("EMP_EMPLEOS", "EMP_CODIGO", "HPL_CODEMP_EMPLEO")
      .join("TCO_TIPOS_CONTRATO", "TCO_CODIGO", "EMP_CODTCO_TIPO_CONTRATO")
      .join("CRG_CARGOS", "CRG_CODIGO", "EMP_CODCRG_CARGO")
      .join("TRA_TRABAJADORES", "TRA_CODIGO", "EMP_CODTRA_TRABAJADOR")
      .join("DEP_DEPENDENCIAS", "DEP_CODIGO", "EMP_CODDEP_DEPENDENCIA")
      .where("id", codPayroll);

    // Consulta para ingresos
    payrollInfo.incomes = await FormsPeriod.query()
      .select(
        "TIG_TIPOS_INGRESO.TIG_NOMBRE as tipo_ingreso",
        "ING_INGRESOS.ING_VALOR as valor",
        "ING_INGRESOS.ING_TIEMPO as tiempo",
        "ING_INGRESOS.ING_UNIDAD_TIEMPO as unidad_tiempo"
      )
      .join("ING_INGRESOS", "ING_CODPPL_PLANILLA", "PPL_CODIGO")
      .join("TIG_TIPOS_INGRESO", "TIG_CODIGO", "ING_CODTIG_TIPO_INGRESO")
      .where("id", codPayroll);

    // Consulta para deducciones
    payrollInfo.deductions = await FormsPeriod.query()
      .select(
        "TDD_TIPOS_DEDUCCIONES.TDD_NOMBRE as tipo_deduccion",
        "DED_DEDUCCIONES.DED_VALOR as valor",
        "DED_DEDUCCIONES.DED_VALOR_PATRONAL as valor_patronal",
        "DED_DEDUCCIONES.DED_TIEMPO as tiempo",
        "DED_DEDUCCIONES.DED_UNIDAD_TIEMPO as unidad_tiempo"
      )
      .join("DED_DEDUCCIONES", "DED_CODPPL_PLANILLA", "PPL_CODIGO")
      .join("TDD_TIPOS_DEDUCCIONES", "TDD_CODIGO", "DED_CODTDD_TIPO_DEDUCCION")
      .where("id", codPayroll);

    // Consulta para reservas
    payrollInfo.reserves = await FormsPeriod.query()
      .select(
        "TRS_TIPOS_RESERVAS.TRS_NOMBRE as tipo_reserva",
        "RSV_RESERVAS.RSV_VALOR as valor",
        "RSV_RESERVAS.RSV_TIEMPO as tiempo",
        "RSV_RESERVAS.RSV_UNIDAD_TIEMPO as unidad_tiempo"
      )
      .join("RSV_RESERVAS", "RSV_CODPPL_PLANILLA", "PPL_CODIGO")
      .join("TRS_TIPOS_RESERVAS", "TRS_CODIGO", "RSV_CODTRS_TIPO_RESERVA")
      .where("id", codPayroll);

    // Consulta para días de incapacidad
    payrollInfo.incapacityDays = await FormsPeriod.query()
      .select(
        "DIP_DIAS_INCAPACIDAD_PROCESADOS.DIP_FECHA_INICIO as fecha_inicio_procesado",
        "DIP_DIAS_INCAPACIDAD_PROCESADOS.DIP_FECHA_FIN as fecha_fin_procesado",
        "INC_INCAPACIDADES.INC_FECHA_INICIO as fecha_inicio",
        "INC_INCAPACIDADES.INC_FECHA_FIN as fecha_fin",
        "TIN_TIPOS_INCAPACIDAD.TIN_NOMBRE as tipo_incapacidad",
        "DIP_DIAS_INCAPACIDAD_PROCESADOS.DIP_DIAS as cantidad_dias"
      )
      .join(
        "DIP_DIAS_INCAPACIDAD_PROCESADOS",
        "DIP_CODPPL_PLANILLA",
        "PPL_CODIGO"
      )
      .join("INC_INCAPACIDADES", "INC_CODIGO", "DIP_CODINC_INCAPACIDAD")
      .join(
        "TIN_TIPOS_INCAPACIDAD",
        "TIN_CODIGO",
        "INC_CODTIN_TIPO_INCAPACIDAD"
      )
      .where("id", codPayroll);

    // Consulta para días de licencia
    payrollInfo.licenceDays = await FormsPeriod.query()
      .select(
        "LIC_LICENCIAS.LIC_FECHA_INICIO as fecha_inicio_licencia",
        "LIC_LICENCIAS.LIC_FECHA_FIN as fecha_fin_licencia",
        "LIC_LICENCIAS.LIC_NUMERO_RESOLUCION as numero_resolucion",
        "LIC_LICENCIAS.LIC_ESTADO as estado"
      )
      .join("HPL_HISTORICOS_PLANILLA", "HPL_CODPPL_PLANILLA", "PPL_CODIGO")
      .join("EMP_EMPLEOS", "EMP_CODIGO", "HPL_CODEMP_EMPLEO")
      .join("LIC_LICENCIAS", "LIC_CODEMP_EMPLEO", "EMP_CODIGO")
      .whereRaw(
        "LIC_LICENCIAS.LIC_FECHA_INICIO BETWEEN PPL_FECHA_INICIO and PPL_FECHA_FIN or LIC_LICENCIAS.LIC_FECHA_FIN BETWEEN PPL_FECHA_INICIO and PPL_FECHA_FIN"
      )
      .where("id", codPayroll);

    // Consulta para deducciones manuales
    payrollInfo.manualDeduction = await FormsPeriod.query()
      .select(
        "DDM_DEDUCCIONES_MANUALES.DDM_ES_PORCENTUAL as porcentual",
        "DDM_DEDUCCIONES_MANUALES.DDM_VALOR as valor",
        "DDM_DEDUCCIONES_MANUALES.DDM_ES_CICLICA as ciclica",
        "DDM_DEDUCCIONES_MANUALES.DDM_NUMERO_CUOTAS as numero_cuotas",
        "DDM_DEDUCCIONES_MANUALES.DDM_MONTO_TOTAL as monto_total",
        "DDM_DEDUCCIONES_MANUALES.DDM_ESTADO as estado",
        "CDC_CUOTAS_DEDUCCION_CICLICA.CDC_NUMERO_CUOTA as numero_cuota",
        "CDC_CUOTAS_DEDUCCION_CICLICA.CDC_VALOR_CUOTA as valor_cuota"
      )
      .join("HPL_HISTORICOS_PLANILLA", "HPL_CODPPL_PLANILLA", "PPL_CODIGO")
      .join("EMP_EMPLEOS", "EMP_CODIGO", "HPL_CODEMP_EMPLEO")
      .join("DDM_DEDUCCIONES_MANUALES", (query) => {
        query.on((subquery) => {
          subquery
            .on("DDM_CODPPL", "=", "PPL_CODIGO")
            .orOn("DDM_CODEMP_EMPLEO", "=", "EMP_CODIGO");
        });
      })
      .join("CDC_CUOTAS_DEDUCCION_CICLICA", (query) => {
        query.on((subquery) => {
          subquery
            .on("CDC_CODDDM_DEDUCCION", "=", "DDM_CODIGO")
            .andOn("CDC_CODPPL_PLANILLA", "=", "PPL_CODIGO");
        });
      })
      .where("id", codPayroll);

    return payrollInfo;
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
}
