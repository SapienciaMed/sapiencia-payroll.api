import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import { IManualDeduction } from "App/Interfaces/ManualDeductionsInterfaces";
import { IManualDeductionRepository } from "App/Repositories/ManualDeductionRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export interface IManualDeductionService {
  createManualDeduction(
    manualDeduction: IManualDeduction
  ): Promise<ApiResponse<IManualDeduction>>;
  getDeductionTypes(): Promise<ApiResponse<IDeductionType[]>>;
  getManualDeductionById(id: number): Promise<ApiResponse<IManualDeduction[]>>;
}

export default class manualDeductionService implements IManualDeductionService {
  constructor(private manualDeductionRepository: IManualDeductionRepository) {}

  //crear dedudcción manual
  async createManualDeduction(
    manualDeduction: IManualDeduction
  ): Promise<ApiResponse<IManualDeduction>> {
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
}
