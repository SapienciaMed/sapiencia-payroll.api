import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IVacation } from "App/Interfaces/VacationsInterfaces";
import { IVacationRepository } from "App/Repositories/VacationRepository";
import { ApiResponse } from "App/Utils/ApiResponses";


export interface IVacationService {
    getVacations(): Promise<ApiResponse<IVacation[]>>;
    createVacation(vacation: IVacation): Promise<ApiResponse<IVacation>>;
    updateVacation(vacation: IVacation, id: number): Promise<ApiResponse<IVacation | null>>;
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

    async createVacation(vacation: IVacation): Promise<ApiResponse<IVacation>>{
        const res = await this.vacationRepository.createVacation(vacation);

        if (!res) {
        return new ApiResponse(
            {} as IVacation ,
            EResponseCodes.FAIL,
            "Ocurrió un error en su Transacción "
        );
        }
        return new ApiResponse(res, EResponseCodes.OK);
    }

    async updateVacation(vacation: IVacation, id: number) {
        const res = await this.vacationRepository.updateVacation(vacation, id);

        if (!res) {
        return new ApiResponse(
            {} as IVacation ,
            EResponseCodes.FAIL,
            "Ocurrió un error en su Transacción "
        );
        }
        return new ApiResponse(res, EResponseCodes.OK); 
    }

}
