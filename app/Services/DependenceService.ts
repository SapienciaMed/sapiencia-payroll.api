import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IDependence } from "App/Interfaces/DependenceInterfaces";
import { IDependenceRepository } from "App/Repositories/DependenceRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface IDependenceService {
  getAllDependencies(): Promise<ApiResponse<IDependence[]>>;
}

export default class DependenceService implements IDependenceService {
  constructor(private dependenceRepository: IDependenceRepository) {}

  async getAllDependencies(): Promise<ApiResponse<IDependence[]>> {
    const res = await this.dependenceRepository.getAllDependencies();
    return new ApiResponse(res, EResponseCodes.OK);
  }
}
