import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IPayrollGenerateRepository } from "../Repositories/PayrollGenerateRepository";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import CoreService from "./External/CoreService";
import { EPayrollTypes } from "App/Constants/PayrollGenerateEnum";
import { PayrollExecutions } from "./SubServices/PayrollExecutions";
import { IIncomeType } from "App/Interfaces/IncomeTypesInterfaces";

export interface IPayrollGenerateService {
  payrollGenerateById(id: number): Promise<ApiResponse<object>>;
  payrollDownloadById(id: number): Promise<ApiResponse<any>>;
  getTypesIncomeList(type: string): Promise<ApiResponse<IIncomeType[]>>;
}

export default class PayrollGenerateService
  extends PayrollExecutions
  implements IPayrollGenerateService
{
  constructor(
    public payrollGenerateRepository: IPayrollGenerateRepository,
    public formsPeriodRepository: FormsPeriodRepository,
    public coreService: CoreService
  ) {
    super(payrollGenerateRepository, formsPeriodRepository, coreService);
  }

  async payrollGenerateById(id: number): Promise<ApiResponse<object>> {
    const formPeriod = await this.formsPeriodRepository.getFormPeriodById(id);
    let result;
    // 1. Validar si la planilla esta autorizada o no existe el periodo
    if (!formPeriod || formPeriod.state === "Autorizada") {
      return new ApiResponse({ error: "fallo" }, EResponseCodes.FAIL, "....");
    }
    // const hashTableCases = {
    //   [EPayrollTypes.biweekly]: this.generatePayrollBiweekly,
    //   [EPayrollTypes.monthly]: this.generatePayrollMonthly,
    //   [EPayrollTypes.vacation]: this.generatePayrollVacations,
    //   [EPayrollTypes.serviceBounty]: this
    // };

    // 2. Elimina todos los elemento calculados (Historico, Reservas, Ingresos ...)
    await this.payrollGenerateRepository.deleteIncomes(id);
    await this.payrollGenerateRepository.deleteDeductions(id);
    await this.payrollGenerateRepository.deleteReserves(id);
    await this.payrollGenerateRepository.deleteIncapacityProcessedDays(id);
    await this.payrollGenerateRepository.deleteHistoryPayroll(id);
    await this.payrollGenerateRepository.deleteCyclicalDeductionInstallment(id);

    //result = await hashTableCases[formPeriod.idFormType](formPeriod);
    // 3. Genera la planilla segun el tipo
    if (EPayrollTypes.biweekly === formPeriod.idFormType) {
      result = await this.generatePayrollBiweekly(formPeriod);
    } else if (EPayrollTypes.monthly === formPeriod.idFormType) {
      result = await this.generatePayrollMonthly(formPeriod);
    } else if (EPayrollTypes.vacation === formPeriod.idFormType) {
      result = await this.generatePayrollVacations(formPeriod);
    } else if (EPayrollTypes.serviceBounty === formPeriod.idFormType) {
      result = await this.generatePayrollBountyService(formPeriod);
    } else if (EPayrollTypes.primaService === formPeriod.idFormType) {
      result = await this.generatePayrollPrimaService(formPeriod);
    } else if (EPayrollTypes.primaChristmas === formPeriod.idFormType) {
      result = await this.generatePayrollChristmas(formPeriod);
    } else if (EPayrollTypes.liquidation === formPeriod.idFormType) {
      result = await this.generatePayrollLiquidationService(formPeriod);
    } else {
      result = {};
    }
    // switch (formPeriod.idFormType) {
    //   case EPayrollTypes.biweekly: // Planilla Quincenal
    //     result = await this.generatePayrollBiweekly(formPeriod);
    //     break;

    //   default:
    //     break;
    // }
    return new ApiResponse(result, EResponseCodes.OK);
  }

  async payrollDownloadById(id: number): Promise<ApiResponse<any>> {
    const toSend: any[] = [];
    const incomeTypeList =
      await this.payrollGenerateRepository.getAllIncomesTypes();
    const deductionsTypeList =
      await this.payrollGenerateRepository.getAllDeductionsTypes();
    const reserveTypeList =
      await this.payrollGenerateRepository.getAllReservesTypes();
    const formPeriod =
      await this.payrollGenerateRepository.getPayrollInformation(id);

    if (!formPeriod || !formPeriod.historicalPayroll || !formPeriod.incomes) {
      return new ApiResponse(
        false,
        EResponseCodes.FAIL,
        "Recurso no encontrado"
      );
    }

    const incomeTypeToShow = incomeTypeList.filter((type) =>
      formPeriod.incomes?.find((i) => i.idTypeIncome === type.id)
    );

    const deductionTypeToShow = deductionsTypeList.filter((type) =>
      formPeriod.deductions?.find((i) => i.idTypeDeduction === type.id)
    );

    const patronalDeductionTypeToShow = deductionsTypeList.filter((type) =>
      formPeriod.deductions?.find(
        (i) => i.idTypeDeduction === type.id && i.patronalValue > 0
      )
    );

    const reserveTypeToShow = reserveTypeList.filter((type) =>
      formPeriod.reserves?.find((i) => i.idTypeReserve === type.id)
    );

    // nombres.forEach(nombre => {
    //   nombresObjeto[nombre] = true;
    // });

    for (const historical of formPeriod.historicalPayroll) {
      let temp = {
        Nombre: `${historical.employment?.worker?.firstName} ${
          historical.employment?.worker?.secondName ?? ""
        } ${historical.employment?.worker?.surname} ${
          historical.employment?.worker?.secondSurname
        }`,
        identificacion: historical.employment?.worker?.numberDocument,
        "Codigo fiscal": historical.employment?.worker?.fiscalIdentification,
        "Nro. Contrato": historical.employment?.contractNumber,
        "Cuenta bancaria": historical.employment?.worker?.accountBankNumber,
        Banco: historical.employment?.worker?.bank,
        "inicio periodo": formPeriod.dateStart,
        "fin periodo": formPeriod.dateEnd,
        "Dias Trabajados": historical.workedDay,
        "Salario Base": historical.salary,
        "Total ingresos": historical.totalIncome,
        "Total deducciones": historical.totalDeduction,
        Total: historical.total,
      };

      incomeTypeToShow.forEach((iType) => {
        const income = formPeriod.incomes?.find(
          (income) =>
            income.idTypeIncome == iType.id &&
            income.idEmployment == historical.idEmployment
        );

        temp[iType.name] = income ? income.value : 0;
      });

      deductionTypeToShow.forEach((iType) => {
        const deduction = formPeriod.deductions?.find(
          (deduction) =>
            deduction.idTypeDeduction == iType.id &&
            deduction.idEmployment == historical.idEmployment
        );

        temp[iType.name] = deduction ? deduction.value : 0;
      });

      patronalDeductionTypeToShow.forEach((iType) => {
        const deduction = formPeriod.deductions?.find(
          (deduction) =>
            deduction.idTypeDeduction == iType.id &&
            deduction.idEmployment == historical.idEmployment
        );

        temp[`${iType.name} patronal`] = deduction
          ? deduction.patronalValue
          : 0;
      });

      reserveTypeToShow.forEach((iType) => {
        const reserve = formPeriod.reserves?.find(
          (reserve) =>
            reserve.idTypeReserve == iType.id &&
            reserve.idEmployment == historical.idEmployment
        );

        temp[iType.name] = reserve ? reserve.value : 0;
      });

      toSend.push(temp);
    }

    console.log(toSend);

    // incomeTypeToShow.forEach(i => {

    // })

    // const valuesForkeys = [];

    // for (const [key, value] of Object.entries(object1)) {
    //   valuesForKeys.push(value);
    // }

    //     const pivotData = [];
    // data.ventas.forEach(item => {
    //   const producto = item.producto;
    //   for (const key in item) {
    //     if (key !== "producto") {
    //       pivotData.push({
    //         producto,
    //         mes: key,
    //         valor: item[key]
    //       });
    //     }
    //   }
    // });

    // for (const historical of formPeriod.historicalPayroll) {

    // }

    //   if (formPeriod?.employmentInfo?.length <= 0) {
    //   return new ApiResponse(
    //     { error: "fallo" },
    //     EResponseCodes.FAIL,
    //     "El reporte que intentas generar no tiene registros o existen problemas"
    //   );
    // }
    const result = this.payrollGenerateRepository.generateXlsx(toSend);
    return result;
  }

  async getTypesIncomeList(type: string): Promise<ApiResponse<IIncomeType[]>> {
    const res = await this.payrollGenerateRepository.getIncomeTypeByType(type);

    if (!res) {
      return new ApiResponse(
        {} as IIncomeType[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
