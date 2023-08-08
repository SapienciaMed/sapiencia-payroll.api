import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IEditVacation, IVacationDay } from "App/Interfaces/VacationDaysInterface";
import VacationDaysRepository from "App/Repositories/VacationDaysRepository";
import { DateTime } from "luxon";

const vacationDayFake: IVacationDay[] = [{
    id: 1,
    codVacation: 1,
    dateFrom: DateTime.fromISO("02/08/2023"),
    dateUntil: DateTime.fromISO("02/16/2023"),
    enjoyedDays: 10,
    paid: false,
    codForm: 1,
    observation:'test',
    userModified: 'test User',
    dateModified: DateTime.now(),
    userCreate: 'test User',
    dateCreate: DateTime.now(),
}];

export class VacationDaysRepositoryFake implements VacationDaysRepository {
    updateVacationRefund(_daysVacation: IEditVacation, _trx: TransactionClientContract): Promise<IVacationDay | null> {
        const list = vacationDayFake;

    return Promise.resolve(list.find((i) => i.id == _daysVacation.id) || null);
    }
    getVacationDays(): Promise<IVacationDay[]> {
        return Promise.resolve(vacationDayFake);
    }
    createVacation(_vacation: IVacationDay): Promise<IVacationDay> {
        return Promise.resolve(vacationDayFake[0]);
    }
    createManyVacation(_vacations: IVacationDay[], _trx: TransactionClientContract): Promise<IVacationDay[]> {
        return Promise.resolve(vacationDayFake);
    }
    updateVacationDay(_data: IVacationDay): Promise<IVacationDay | null> {
        const list = vacationDayFake;

    return Promise.resolve(list.find((i) => i.id == _data.id) || null);
    }
  
  
}