import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IIncapacity } from "App/Interfaces/IncapacityInterfaces";
import { IIncapacityRepository } from "App/Repositories/IncapacityRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface IIncapacityService {

  createIncapacity(incapacity: IIncapacity): Promise<ApiResponse<IIncapacity>>;

}

export default class IncapacityService implements IIncapacityService {

  constructor(
    private incapacityRepository: IIncapacityRepository,
  ) {}

  async createIncapacity(incapacity: IIncapacity): Promise<ApiResponse<IIncapacity>>{

    const res = await this.incapacityRepository.createIncapacity(incapacity);

    if (!res) {

      return new ApiResponse({} as IIncapacity , EResponseCodes.FAIL, "Ocurrió un error en su Transacción " );

    }

    return new ApiResponse(res, EResponseCodes.OK);

  }

}
