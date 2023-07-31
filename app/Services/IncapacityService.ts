import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IIncapacity , IFilterIncapacity, IGetIncapacity } from "App/Interfaces/IncapacityInterfaces";
import { IIncapacityRepository } from "App/Repositories/IncapacityRepository";
import { ApiResponse , IPagingData } from "App/Utils/ApiResponses";

export interface IIncapacityService {

  createIncapacity(incapacity: IIncapacity): Promise<ApiResponse<IIncapacity>>;
  getIncapacityPaginate( filters: IFilterIncapacity ): Promise<ApiResponse<IPagingData<IGetIncapacity>>>;
  getIncapacityById(id: number): Promise<ApiResponse<IIncapacity>>;

}

export default class IncapacityService implements IIncapacityService {

  constructor(
    private incapacityRepository: IIncapacityRepository,
  ) {}

  //?CREAR INCAPACIDAD
  async createIncapacity(incapacity: IIncapacity): Promise<ApiResponse<IIncapacity>>{

    const res = await this.incapacityRepository.createIncapacity(incapacity);

    if (!res) {

      return new ApiResponse({} as IIncapacity , EResponseCodes.FAIL, "Ocurrió un error en su Transacción " );

    }

    return new ApiResponse(res, EResponseCodes.OK);

}

}
