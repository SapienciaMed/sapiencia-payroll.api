import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IVacation } from "App/Interfaces/VacationsInterfaces";
import { IVacationRepository } from "App/Repositories/VacationRepository";
import { ApiResponse } from "App/Utils/ApiResponses";


export interface IVacationService {
  getVacations(): Promise<ApiResponse<IVacation[]>>;
}

export default class VacationService implements IVacationService {

    constructor(
        private vacationRepository: IVacationRepository,
    ) {}

    async getVacations(): Promise<ApiResponse<IVacation[]>> {
        const res = await this.vacationRepository.getVacations();

        if (!res) {
        return new ApiResponse(
            [] as IVacation [],
            EResponseCodes.FAIL,
            "No se encontraron registros"
        );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    } 

}
