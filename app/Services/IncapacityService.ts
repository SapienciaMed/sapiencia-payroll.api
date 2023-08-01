import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import {
  IIncapacity,
  IFilterIncapacity,
  IGetIncapacityList,
} from "App/Interfaces/IncapacityInterfaces";

import { IIncapacityTypes } from "App/Interfaces/TypesIncapacityInterface";

import { IIncapacityRepository } from "App/Repositories/IncapacityRepository";
import { IIncapacityTypesRepository } from "App/Repositories/IncapacityTypesRepository";

import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export interface IIncapacityService {
  createIncapacity(incapacity: IIncapacity): Promise<ApiResponse<IIncapacity>>;
  getIncapacityPaginate(
    filters: IFilterIncapacity
  ): Promise<ApiResponse<IPagingData<IGetIncapacityList>>>;
  getIncapacityById(idr: number): Promise<ApiResponse<IGetIncapacityList>>;
  getIncapacityTypes(): Promise<ApiResponse<IIncapacityTypes[]>>;
}

export default class IncapacityService implements IIncapacityService {
  constructor(
    private incapacityRepository: IIncapacityRepository,
    private incapacityTypesRepository: IIncapacityTypesRepository
  ) {}

  //?CREAR INCAPACIDAD
  async createIncapacity(
    incapacity: IIncapacity
  ): Promise<ApiResponse<IIncapacity>> {
    const res = await this.incapacityRepository.createIncapacity(incapacity);

    if (!res) {
      return new ApiResponse(
        {} as IIncapacity,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  //?OBTENER LISTADO DE INCAPACIDADES EN GENERAL
  async getIncapacityTypes(): Promise<ApiResponse<IIncapacityTypes[]>> {
    const res = await this.incapacityTypesRepository.getIncapacityTypes();

    if (!res) {
      return new ApiResponse(
        [] as IIncapacityTypes[],
        EResponseCodes.FAIL,
        "No se encontraron registros"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  //?BUSCAR INCAPACIDAD PAGINADO Y RELACIONAL
  async getIncapacityPaginate(
    filters: IFilterIncapacity
  ): Promise<ApiResponse<IPagingData<any>>> {
    const incapacities = await this.incapacityRepository.getIncapacityPaginate(
      filters
    );
    return new ApiResponse(incapacities, EResponseCodes.OK);
  }

  //?BUSCAR INCAPACIDAD POR ID RELACIONAL
  async getIncapacityById(
    id: number
  ): Promise<ApiResponse<IGetIncapacityList>> {
    const incapacity = await this.incapacityRepository.getIncapacityById(id);

    if (!incapacity) {
      return new ApiResponse(
        {} as IGetIncapacityList,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(incapacity, EResponseCodes.OK);
  }
}
