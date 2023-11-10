import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ICharge, IChargeFilters } from "App/Interfaces/ChargeInterfaces";
import { IChargesRepository } from "App/Repositories/ChargesRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export interface IChargeService {
  createCharge(charge: ICharge): Promise<ApiResponse<ICharge>>;
  updateCharge(
    charge: ICharge,
    id: number
  ): Promise<ApiResponse<ICharge | null>>;
  getChargesPaginate(
    filters: IChargeFilters
  ): Promise<ApiResponse<IPagingData<ICharge>>>;
}

export default class ChargeService implements IChargeService {
  constructor(private chargeRepository: IChargesRepository) {}

  async createCharge(charge: ICharge): Promise<ApiResponse<ICharge>> {
    const res = await this.chargeRepository.createCharge(charge);

    if (!res) {
      return new ApiResponse(
        {} as ICharge,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async updateCharge(
    charge: ICharge,
    id: number
  ): Promise<ApiResponse<ICharge | null>> {
    const res = await this.chargeRepository.updateCharge(charge, id);

    if (!res) {
      return new ApiResponse(
        {} as ICharge,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getChargesPaginate(
    filters: IChargeFilters
  ): Promise<ApiResponse<IPagingData<ICharge>>> {
    const charges = await this.chargeRepository.getChargesPaginate(filters);
    return new ApiResponse(charges, EResponseCodes.OK);
  }
}
