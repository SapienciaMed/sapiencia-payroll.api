import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IPayrollGenerateRepository } from "../Repositories/PayrollGenerateRepository";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
// import CoreService from "./External/CoreService";

export interface IPayrollGenerateService {
  payrollGenerateById(id: number): Promise<ApiResponse<boolean>>;
}

export default class PayrollGenerateService implements IPayrollGenerateService {
  constructor(
    private payrollGenerateRepository: IPayrollGenerateRepository,
    private formsPeriodRepository: FormsPeriodRepository
  ) // private coreService: CoreService
  {}

  async payrollGenerateById(id: number): Promise<ApiResponse<boolean>> {
    const formPeriod = await this.formsPeriodRepository.getFormPeriodById(id);

    // 1. Validar si la planilla esta autorizada o no existe el periodo
    if (!formPeriod || formPeriod.state === "Autorizada") {
      return new ApiResponse(false, EResponseCodes.FAIL, "....");
    }

    // 2. Elimina todos los elemento calculados (Historico, Reservas, Ingresos ...)

    // 3. Genera la planilla segun el tipo
    switch (formPeriod.idFormType) {
      case 1: // Planilla Quincenal
        await this.generatePayrollBiweekly(formPeriod);
        break;

      default:
        break;
    }

    return new ApiResponse(true, EResponseCodes.OK);
  }

  async generatePayrollBiweekly(formPeriod: IFormPeriod): Promise<void> {
    //buscar los empelados activos de la planilla quincenal.

    const emploments = await this.payrollGenerateRepository.getActiveEmploments(
      new Date(String(formPeriod.dateEnd))
    );

    Promise.all(
      emploments.map(async (emploment) => {
        try {
          // 1. Calcula Licencia
          await this.calculateLicense(emploment, formPeriod);

          // 2. Calcula Licencia
          await this.calculateIncapacity(emploment, formPeriod);

          // Calcula Renta
          await this.calculateISR(emploment, formPeriod);
        } catch (error) {
          // Crea historico Fallido
        }
      })
    );
  }

  async calculateLicense(
    _employment: IEmployment,
    _formPeriod: IFormPeriod
  ): Promise<void> {
    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
  }

  async calculateIncapacity(
    _employment: IEmployment,
    _formPeriod: IFormPeriod
  ): Promise<void> {
    // 1. buscar incapacidades vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
  }

  async calculateISR(
    employment: IEmployment,
    formPeriod: IFormPeriod
  ): Promise<void> {
    // 1. Buscar ingresos afectos
    console.log('akive1')
    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        1,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0
      );

    console.log(affectionValue);

    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
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
