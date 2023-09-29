import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IPayrollGenerateRepository } from "../Repositories/PayrollGenerateRepository";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import CoreService from "./External/CoreService";
import { EPayrollTypes } from "App/Constants/PayrollGenerateEnum";
import { PayrollExecutions } from "./SubServices/PayrollExecutions";

export interface IPayrollGenerateService {
  payrollGenerateById(id: number): Promise<ApiResponse<boolean>>;
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

  async payrollGenerateById(id: number): Promise<ApiResponse<boolean>> {
    const formPeriod = await this.formsPeriodRepository.getFormPeriodById(id);

    // 1. Validar si la planilla esta autorizada o no existe el periodo
    if (!formPeriod || formPeriod.state === "Autorizada") {
      return new ApiResponse(false, EResponseCodes.FAIL, "....");
    }

    // 2. Elimina todos los elemento calculados (Historico, Reservas, Ingresos ...)
    await this.payrollGenerateRepository.deleteIncomes(id);
    await this.payrollGenerateRepository.deleteDeductions(id);
    await this.payrollGenerateRepository.deleteReserves(id);
    await this.payrollGenerateRepository.deleteHistoryPayroll(id);
    // 3. Genera la planilla segun el tipo
    switch (formPeriod.idFormType) {
      case EPayrollTypes.biweekly: // Planilla Quincenal
        await this.generatePayrollBiweekly(formPeriod);
        break;

      default:
        break;
    }

    return new ApiResponse(true, EResponseCodes.OK);
  }
}
