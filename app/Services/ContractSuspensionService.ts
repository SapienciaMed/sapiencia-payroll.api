import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IcontractSuspension } from "App/Interfaces/ContractSuspensionInterfaces";
import { IContractSuspensionRepository } from "App/Repositories/ContractSuspensionRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface IContractSuspensionService {
  createContractSuspension(
    contractSuspension: IcontractSuspension
  ): Promise<ApiResponse<IcontractSuspension>>;
}

export default class ContractSuspensionService
  implements IContractSuspensionService
{
  constructor(
    private contractSuspensionRepository: IContractSuspensionRepository
  ) {}

  async createContractSuspension(
    contractSuspension: IcontractSuspension
  ): Promise<ApiResponse<IcontractSuspension>> {
    const res =
      await this.contractSuspensionRepository.createContractSuspension(
        contractSuspension
      );

    if (!res) {
      return new ApiResponse(
        {} as IcontractSuspension,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
