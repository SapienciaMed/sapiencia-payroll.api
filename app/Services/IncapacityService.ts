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

  //?BUSCAR INCAPACIDAD PAGINADO
  async getIncapacityPaginate( filters: IFilterIncapacity ): Promise<ApiResponse<IPagingData<IGetIncapacity>>> {

    const workers = await this.incapacityRepository.getIncapacity(filters);
    return new ApiResponse(workers, EResponseCodes.OK);

  }

  //?BUSCAR INCAPACIDAD POR ID
  async getIncapacityById(id: number): Promise<ApiResponse<IIncapacity>> {

    const incapacity = await this.incapacityRepository.getIncapacityById(id);

    if (!incapacity?.id) {
      return new ApiResponse(
        {} as IIncapacity,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    const res = incapacity as IIncapacity;
    return new ApiResponse(res, EResponseCodes.OK);

  }

}
