import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IPayrollGenerateRepository } from "../Repositories/PayrollGenerateRepository";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import CoreService from "./External/CoreService";
import { EPayrollTypes } from "App/Constants/PayrollGenerateEnum";
import { PayrollExecutions } from "./SubServices/PayrollExecutions";

export interface IPayrollGenerateService {
  payrollGenerateById(id: number): Promise<ApiResponse<object>>;
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
    const hashTableCases = {
      [EPayrollTypes.biweekly]: this.generatePayrollBiweekly,
      [EPayrollTypes.monthly]: this.generatePayrollMonthly,
      [EPayrollTypes.vacation]: this.generatePayrollVacations,
      [EPayrollTypes.serviceBounty]: this
    };

    // 2. Elimina todos los elemento calculados (Historico, Reservas, Ingresos ...)
    await this.payrollGenerateRepository.deleteIncomes(id);
    await this.payrollGenerateRepository.deleteDeductions(id);
    await this.payrollGenerateRepository.deleteReserves(id);
    await this.payrollGenerateRepository.deleteIncapacityProcessedDays(id);
    await this.payrollGenerateRepository.deleteHistoryPayroll(id);

    //result = await hashTableCases[formPeriod.idFormType](formPeriod);
    // 3. Genera la planilla segun el tipo
    if (EPayrollTypes.biweekly === formPeriod.idFormType) {
      result = await this.generatePayrollBiweekly(formPeriod);
    } else if (EPayrollTypes.monthly === formPeriod.idFormType) {
      result = await this.generatePayrollMonthly(formPeriod);
    } else if (EPayrollTypes.vacation === formPeriod.idFormType) {
      result = await this.generatePayrollVacations(formPeriod);
    } else if (EPayrollTypes.serviceBounty === formPeriod.idFormType) {
      result = await this.generatePayrollVacations(formPeriod);
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
    console.log(result);
    return new ApiResponse(result, EResponseCodes.OK);
  }
}
