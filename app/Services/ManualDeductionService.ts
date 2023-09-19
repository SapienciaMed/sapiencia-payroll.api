import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import {
  IManualDeduction,
  IManualDeductionFilters,
} from "App/Interfaces/ManualDeductionsInterfaces";
import { IEmploymentRepository } from "App/Repositories/EmploymentRepository";
import { IManualDeductionRepository } from "App/Repositories/ManualDeductionRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export interface IManualDeductionService {
  createManualDeduction(
    manualDeduction: IManualDeduction
  ): Promise<ApiResponse<IManualDeduction>>;
  getDeductionTypes(): Promise<ApiResponse<IDeductionType[]>>;
  getManualDeductionById(id: number): Promise<ApiResponse<IManualDeduction[]>>;
  getDeductionTypesByType(type: string): Promise<ApiResponse<IDeductionType[]>>;
  getManualDeductionPaginate(
    filters: IManualDeductionFilters
  ): Promise<ApiResponse<IPagingData<IManualDeduction>>>;
  updateManualDeduction(
    incapacity: IManualDeduction,
    id: number
  ): Promise<ApiResponse<IManualDeduction | null>>;
}

export default class ManualDeductionService implements IManualDeductionService {
  constructor(
    private manualDeductionRepository: IManualDeductionRepository,
    private employmentRepository: IEmploymentRepository
  ) {}

  //crear dedudcción manual
  async createManualDeduction(
    manualDeduction: IManualDeduction
  ): Promise<ApiResponse<IManualDeduction>> {
    const salary = await this.employmentRepository.getChargeEmployment(
      manualDeduction.codEmployment
    );
    const deductions =
      await this.manualDeductionRepository.getManualDeductionByEmploymentId(
        manualDeduction.codEmployment
      );
    let totalValue = 0;
    if (deductions !== null) {
      for (const deduction of deductions) {
        if (deduction.porcentualValue && deduction.value > 0)
          totalValue += (deduction.value / 100) * Number(salary.baseSalary);
        else totalValue += deduction.value;
      }
    }
    if (manualDeduction.value + totalValue > Number(salary.baseSalary) * 0.5) {
      return new ApiResponse(
        {} as IManualDeduction,
        EResponseCodes.FAIL,
        "La deducción supera más del 50% del salario"
      );
    }
    const res = await this.manualDeductionRepository.createManualDeduction(
      manualDeduction
    );

    if (!res) {
      return new ApiResponse(
        {} as IManualDeduction,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async updateManualDeduction(
    deduction: IManualDeduction,
    id: number
  ): Promise<ApiResponse<IManualDeduction | null>> {
    const salary = await this.employmentRepository.getChargeEmployment(
      deduction.codEmployment
    );
    const deductions =
      await this.manualDeductionRepository.getManualDeductionByEmploymentId(
        deduction.codEmployment
      );
    let totalValue = 0;

    if (deductions !== null) {
      for (const deduction of deductions) {
        if (deduction.id !== id) {
          if (deduction.porcentualValue && deduction.value > 0) {
            totalValue += Number((deduction.value / 100) * Number(salary.baseSalary));
          } else {
            totalValue += Number(deduction.value);
          }
        }
      }
    }
    if (deduction.value + totalValue > Number(salary.baseSalary) * 0.5) {
      return new ApiResponse(
        {} as IManualDeduction,
        EResponseCodes.FAIL,
        "La deducción supera más del 50% del salario"
      );
    }
    const res = await this.manualDeductionRepository.updateManualDeduction(
      deduction,
      id
    );

    if (!res) {
      return new ApiResponse(
        {} as IManualDeduction,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  //obtener tipos de deducciones
  async getDeductionTypes(): Promise<ApiResponse<IDeductionType[]>> {
    const res = await this.manualDeductionRepository.getDeductionTypes();
    if (!res) {
      return new ApiResponse(
        {} as IDeductionType[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getDeductionTypesByType(
    type: string
  ): Promise<ApiResponse<IDeductionType[]>> {
    const res = await this.manualDeductionRepository.getDeductionTypesByType(
      type
    );
    if (!res) {
      return new ApiResponse(
        {} as IDeductionType[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
  async getManualDeductionById(
    id: number
  ): Promise<ApiResponse<IManualDeduction[]>> {
    const res = await this.manualDeductionRepository.getManualDeductionById(id);

    if (!res) {
      return new ApiResponse(
        {} as IManualDeduction[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getManualDeductionPaginate(
    filters: IManualDeductionFilters
  ): Promise<ApiResponse<IPagingData<IManualDeduction>>> {
    const vacations =
      await this.manualDeductionRepository.getManualDeductionPaginate(filters);
    return new ApiResponse(vacations, EResponseCodes.OK);
  }
}
