import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ILicence, ILicenceFilters } from "App/Interfaces/LicenceInterfaces";
import { ILicenceType } from "App/Interfaces/LicenceTypesInterface";
import { IIncapacityRepository } from "App/Repositories/IncapacityRepository";
import { ILicenceRepository } from "App/Repositories/LicenceRepository";
import { IVacationDaysRepository } from "App/Repositories/VacationDaysRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export interface ILicenceService {
  createLicence(licence: ILicence): Promise<ApiResponse<ILicence>>;
  getLicenceTypes(): Promise<ApiResponse<ILicenceType[]>>;
  getLicencePaginate(
    filters: ILicenceFilters
  ): Promise<ApiResponse<IPagingData<ILicence>>>;
  getLicenceById(id: number): Promise<ApiResponse<ILicence[]>>;
}

export default class LicenceService implements ILicenceService {
  constructor(
    private licenceRepository: ILicenceRepository,
    private vacationDaysRepository: IVacationDaysRepository,
    private incapacityRepository: IIncapacityRepository
  ) {}

  //crear licencia
  async createLicence(licence: ILicence): Promise<ApiResponse<ILicence>> {
    const licenceFind =
      await this.licenceRepository.getLicenceDateCodEmployment(
        licence.codEmployment,
        licence.dateStart,
        licence.dateEnd
      );
    const vacationDayFind =
      await this.vacationDaysRepository.getVacationDateCodEmployment(
        licence.codEmployment,
        licence.dateStart,
        licence.dateEnd
      );
    const incapacityFind =
      await this.incapacityRepository.getIncapacityDateCodEmployment(
        licence.codEmployment,
        licence.dateStart,
        licence.dateEnd
      );
    let message = "";
    if (licenceFind.length > 0) {
      message =
        "El empleado ya tiene registrada una licencia con las mismas fechas";
    } else if (vacationDayFind.length > 0) {
      message =
        "El empleado tiene un periodo de vacaciones con las mismas fechas";
    } else {
      message =
        "El empleado tiene registrada una incapacidad con las mismas fechas";
    }
    if (
      licenceFind.length > 0 ||
      vacationDayFind.length > 0 ||
      incapacityFind.length > 0
    ) {
      return new ApiResponse({} as ILicence, EResponseCodes.FAIL, message);
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

  async getLicenceById(id: number): Promise<ApiResponse<ILicence[]>> {
    const res = await this.licenceRepository.getLicenceById(id);

    if (!res) {
      return new ApiResponse(
        {} as ILicence[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
