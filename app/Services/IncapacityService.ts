import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import {
  IIncapacity,
  IFilterIncapacity,
  IGetIncapacity,
} from "App/Interfaces/IncapacityInterfaces";

import { IIncapacityTypes } from "App/Interfaces/TypesIncapacityInterface";

import { IIncapacityRepository } from "App/Repositories/IncapacityRepository";
import { IIncapacityTypesRepository } from "App/Repositories/IncapacityTypesRepository";

import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export interface IIncapacityService {
  createIncapacity(incapacity: IIncapacity): Promise<ApiResponse<IIncapacity>>;
  getIncapacityPaginate(
    filters: IFilterIncapacity
  ): Promise<ApiResponse<IPagingData<IGetIncapacity>>>;
  getIncapacityById(id: number): Promise<ApiResponse<IGetIncapacity>>;
  getIncapacityTypes(): Promise<ApiResponse<IIncapacityTypes[]>>;
  updateIncapacity(
    incapacity: IIncapacity,
    id: number
  ): Promise<ApiResponse<IIncapacity | null>>;
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
    const incapacityFind =
      await this.incapacityRepository.getIncapacityDateCodEmployment(
        incapacity
      );

    if (incapacityFind.length > 0) {
      return new ApiResponse(
        {} as IIncapacity,
        EResponseCodes.FAIL,
        "El empleado ya tiene registrada una incapacidad con las mismas fechas"
      );
    }

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
  ): Promise<ApiResponse<IPagingData<IGetIncapacity>>> {
    const incapacities = await this.incapacityRepository.getIncapacityPaginate(
      filters
    );

    return new ApiResponse(incapacities, EResponseCodes.OK);
  }

  //?BUSCAR INCAPACIDAD POR ID RELACIONAL
  async getIncapacityById(id: number): Promise<ApiResponse<IGetIncapacity>> {
    const incapacity = await this.incapacityRepository.getIncapacityById(id);

    if (!incapacity) {
      return new ApiResponse(
        {} as IGetIncapacity,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(incapacity, EResponseCodes.OK);
  }

  //?ACTUALIZAR INCAPACIDAD CON ID - TODO CON BODY
  async updateIncapacity(
    incapacity: IIncapacity,
    id: number
  ): Promise<ApiResponse<IIncapacity | null>> {
    const res = await this.incapacityRepository.updateIncapacity(
      incapacity,
      id
    );

    if (!res) {
      return new ApiResponse(
        {} as IIncapacity,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
