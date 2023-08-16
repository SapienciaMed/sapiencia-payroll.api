import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IEditVacation, IVacationDayValidator } from "App/Interfaces/VacationDaysInterface";
import { IVacation,IVacationFilters, IVacationSearchParams } from "App/Interfaces/VacationsInterfaces";
import vacationRepository from "App/Repositories/VacationRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const vacationFake: IVacation[] = [{
    id: 1,
    codEmployment: 1,
    period: 2023,
    dateFrom: DateTime.fromISO("01/08/2023"),
    dateUntil: DateTime.fromISO("01/08/2023"),
    days: 15,
    periodFormer: 3,
    enjoyed: 10,
    refund: 5,
    available: 8,
    periodClosed: false
},
{
    id: 2,
    codEmployment: 2,
    period: 2023,
    dateFrom: DateTime.fromISO("01/08/2023"),
    dateUntil: DateTime.fromISO("01/08/2023"),
    days: 15,
    periodFormer: 0,
    enjoyed: 15,
    refund: 0,
    available: 15,
    periodClosed: false
}];



export class VacationRepositoryFake implements vacationRepository {
    getVacations(): Promise<IVacation[]> {
        return Promise.resolve(vacationFake);
    }
    getVacationsByParams(_params: IVacationSearchParams): Promise<IVacation | null> {
        const list = vacationFake;

    return new Promise((res) => {
      const vacation = list.find((vacation) =>  vacation.codEmployment === _params.workerId);

      if (!vacation) {
        return res(null);
      }

      return res(vacation);
    });
    }
    getVacation(_filters: IVacationFilters): Promise<IPagingData<IVacation>> {
        return Promise.resolve({ array: vacationFake, meta: { total: 100 } });
    }
    createVacation(_user: IVacation): Promise<IVacation> {
        return Promise.resolve(vacationFake[0]);
    }
    updateVacation(_daysVacation: IEditVacation, _trx: TransactionClientContract): Promise<IVacation | null> {
        const list = vacationFake;

    return Promise.resolve(list.find((i) => i.id == _daysVacation.id) || null);
  }
    
    updateVacationDays(_daysVacation: IVacationDayValidator): Promise<IVacation | null> {
        const list = vacationFake;

    return Promise.resolve(list.find((i) => i.id == _daysVacation.vacationDay[0].codVacation) || null);
    }

}