import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IEditVacation, IVacationDay, IVacationDayValidator } from "App/Interfaces/VacationDaysInterface";
import { IVacation, IVacationFilters } from "App/Interfaces/VacationsInterfaces";
import { IVacationDaysRepository } from "App/Repositories/VacationDaysRepository";
import { IVacationRepository } from "App/Repositories/VacationRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";


export interface IVacationService {
    getVacations(): Promise<ApiResponse<IVacation[]>>;
    createVacation(vacation: IVacation): Promise<ApiResponse<IVacation>>;
    updateVacation(vacationEdit: IEditVacation,trx: TransactionClientContract): Promise<ApiResponse<IVacation>> 
    updateVacationDay(data: IVacationDay): Promise<ApiResponse<IVacationDay | null>>
    getVacationsByParams(params): Promise<ApiResponse<IVacation | null>>;
    createManyVacation(vacations: IVacationDayValidator,trx: TransactionClientContract): Promise<ApiResponse<IVacationDay[]>>;
    getVacationPaginate(filters: IVacationFilters): Promise<ApiResponse<IPagingData<IVacation>>>
}

export default class VacationService implements IVacationService {

    constructor(
        private vacationRepository: IVacationRepository,
        private vacationDaysRepository: IVacationDaysRepository,
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

    async getVacationsByParams(params): Promise<ApiResponse<IVacation>> {
        const res = await this.vacationRepository.getVacationsByParams(params);

        if (!res) {
        return new ApiResponse(
            {} as IVacation ,
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

    async updateVacation(vacationEdit: IEditVacation,trx: TransactionClientContract): Promise<ApiResponse<IVacation>> {
        const res = await this.vacationRepository.updateVacation(vacationEdit,trx);
        await this.vacationDaysRepository.updateVacationRefund(vacationEdit,trx)
        await trx.commit();
        if (!res) {
        return new ApiResponse(
            {} as IVacation ,
            EResponseCodes.FAIL,
            "Ocurrió un error en su Transacción "
        );
        }
        return new ApiResponse(res, EResponseCodes.OK); 
    }

    async updateVacationDay(data: IVacationDay) {
        const res = await this.vacationDaysRepository.updateVacationDay(data);

        if (!res) {
        return new ApiResponse(
            {} as IVacationDay ,
            EResponseCodes.FAIL,
            "Ocurrió un error en su Transacción "
        );
        }
        return new ApiResponse(res, EResponseCodes.OK); 
    }

    async createManyVacation(vacations: IVacationDayValidator, trx: TransactionClientContract): Promise<ApiResponse<IVacationDay[]>>{
        const vacationEnjoyed = await this.vacationDaysRepository.createManyVacation(vacations.vacationDay,trx);
        await this.vacationRepository.updateVacationDays(vacations)
        await trx.commit();

        if (!vacationEnjoyed) {
        return new ApiResponse(
            {} as IVacationDay[] ,
            EResponseCodes.FAIL,
            "Ocurrió un error en su Transacción "
        );
        }
        return new ApiResponse(vacationEnjoyed, EResponseCodes.OK);
    }
    async getVacationPaginate(
        filters: IVacationFilters
      ): Promise<ApiResponse<IPagingData<IVacation>>> {
        const vacations = await this.vacationRepository.getVacation(
          filters
        );
        return new ApiResponse(vacations, EResponseCodes.OK);
      }


}
