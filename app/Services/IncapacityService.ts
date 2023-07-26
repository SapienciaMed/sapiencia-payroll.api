import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import {
  IIncapacity,
  IIncapacityFilters,
} from "App/Interfaces/IncapacityInterfaces";
import { IIncapacityRepository } from "App/Repositories/IncapacityRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export interface IIncapacityService {
  getIncapacitiesPaginated(
    filters: IIncapacityFilters
  ): Promise<ApiResponse<IPagingData<IIncapacity>>>;
  createIncapacity(data: IIncapacity): Promise<ApiResponse<IIncapacity>>;
  updateIncapacity(
    data: IIncapacity,
    id: number
  ): Promise<ApiResponse<IIncapacity>>;
  deleteIncapacity(id: number): Promise<ApiResponse<boolean>>;
}

export default class IncapacityService implements IIncapacityService {
  constructor(private incapacityRepository: IIncapacityRepository) {}

  async updateIncapacity(
    data: IIncapacity,
    id: number
  ): Promise<ApiResponse<IIncapacity>> {
    const res = await this.incapacityRepository.updateIncapacity(data, id);

    if (!res) {
      return new ApiResponse(
        {} as IIncapacity,
        EResponseCodes.WARN,
        "El Registro indicado no exite"
      );
    } else {
      return new ApiResponse(res, EResponseCodes.OK);
    }
  }

  async createIncapacity(data: IIncapacity): Promise<ApiResponse<IIncapacity>> {
    const res = await this.incapacityRepository.createIncapacity(data);
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async deleteIncapacity(id: number): Promise<ApiResponse<boolean>> {
    const res = await this.incapacityRepository.deleteIncapacity(id);
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getIncapacitiesPaginated(
    filters: IIncapacityFilters
  ): Promise<ApiResponse<IPagingData<IIncapacity>>> {
    const res = await this.incapacityRepository.getIncapacitiesPaginated(
      filters
    );
    return new ApiResponse(res, EResponseCodes.OK);
  }
}
