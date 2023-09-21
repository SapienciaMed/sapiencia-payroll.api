import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";

import { IPayrollGenerateRepository } from "../Repositories/PayrollGenerateRepository";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";

export interface IPayrollGenerateService {
  payrollGenerateById(id: number): Promise<ApiResponse<boolean>>;
}

export default class PayrollGenerateService implements IPayrollGenerateService {
  constructor(
    private payrollGenerateRepository: IPayrollGenerateRepository,
    private formsPeriodRepository: FormsPeriodRepository
  ) {}

  async payrollGenerateById(id: number): Promise<ApiResponse<boolean>> {
    const formPeriod = await this.formsPeriodRepository.getFormPeriodById(id);

    // Validar si la planilla esta autorizada o no existe el period
    if (!formPeriod || formPeriod.length === 0) {
      return new ApiResponse(false, EResponseCodes.FAIL, "....");
    }

    switch (formPeriod[1].idFormType) {
      case 1: // Planilla Quincenal
        await this.generatePayrollBiweekly(formPeriod[1]);
        break;

      default:
        break;
    }

    return new ApiResponse(true, EResponseCodes.OK);
  }

  async generatePayrollBiweekly(formsPeriod: IFormPeriod): Promise<void> {

    //1. buscar los empelados activos de la planilla quincenal. 

    





  }
}

// class PayrollBiweekly {
//   constructor(private payrollGenerateRepository: IPayrollGenerateRepository) {}

//   async payrollGenerateById(id: number): Promise<ApiResponse<boolean>> {
//     const formsPeriod = await this.formsPeriodRepository.getFormPeriodById(id);

//     // Validar si la planilla esta autorizada o no existe el period
//     if (!formsPeriod || formsPeriod.length === 0) {
//       return new ApiResponse(false, EResponseCodes.FAIL, "....");
//     }

//     switch (formsPeriod[1].idFormType) {
//       case 1: // Planilla Quincenal
//         break;

//       default:
//         break;
//     }

//     return new ApiResponse(true, EResponseCodes.OK);
//   }
// }
