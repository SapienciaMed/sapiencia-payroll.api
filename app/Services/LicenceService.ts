import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ILicence, ILicenceFilters } from "App/Interfaces/LicenceInterfaces";
import { ILicenceType } from "App/Interfaces/LicenceTypesInterface";
import { ILicenceRepository } from "App/Repositories/LicenceRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export interface ILicenceService {
  createLicence(licence: ILicence): Promise<ApiResponse<ILicence>>;
  getLicenceTypes(): Promise<ApiResponse<ILicenceType[]>>;
  getLicencePaginate(
    filters: ILicenceFilters
  ): Promise<ApiResponse<IPagingData<ILicence>>>;
}

export default class LicenceService implements ILicenceService {
  constructor(private licenceRepository: ILicenceRepository) {}

  //crear licencia
  async createLicence(licence: ILicence): Promise<ApiResponse<ILicence>> {
    const incapacityFind =
      await this.licenceRepository.getLicenceDateCodEmployment(licence);

    if (incapacityFind.length > 0) {
      return new ApiResponse(
        {} as ILicence,
        EResponseCodes.FAIL,
        "El empleado ya tiene registrada una licencia con las mismas fechas"
      );
    }

    const res = await this.licenceRepository.createLicence(licence);

    if (!res) {
      return new ApiResponse(
        {} as ILicence,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  //obtener tipos de licencias
  async getLicenceTypes(): Promise<ApiResponse<ILicenceType[]>> {
    const res = await this.licenceRepository.getLicenceTypes();
    if (!res) {
      return new ApiResponse(
        {} as ILicenceType[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getLicencePaginate(
    filters: ILicenceFilters
  ): Promise<ApiResponse<IPagingData<ILicence>>> {
    const vacations = await this.licenceRepository.getLicencePaginate(filters);
    return new ApiResponse(vacations, EResponseCodes.OK);
  }
}
