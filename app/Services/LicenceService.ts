import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ILicence } from "App/Interfaces/LicenceInterfaces";
import { ILicenceRepository } from "App/Repositories/LicenceRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface ILicenceService {
    createLicence(licence: ILicence): Promise<ApiResponse<ILicence>>;
  }
  
  export default class LicenceService implements ILicenceService {
    constructor(
      private licenceRepository: ILicenceRepository,
    ) {}
  
  //crear licencia
    async createLicence(licence: ILicence): Promise<ApiResponse<ILicence>> {
      const incapacityFind =
        await this.licenceRepository.getLicenceDateCodEmployment(
          licence
        );
  
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
  
    
  }
  