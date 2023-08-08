import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IEditVacation, IVacationDay } from "App/Interfaces/VacationDaysInterface";
import VacationDay from "App/Models/VacationDay";

export interface IVacationDaysRepository {
  getVacationDays(): Promise<IVacationDay[]>;
  createVacation(vacation: IVacationDay): Promise<IVacationDay>;
  updateVacationDay(
    data: IVacationDay
  ): Promise<IVacationDay | null>;
  updateVacationRefund(daysVacation: IEditVacation,trx: TransactionClientContract): Promise<IVacationDay | null>
  createManyVacation(vacations: IVacationDay[],trx: TransactionClientContract) :Promise<IVacationDay[]>;
}

export default class VacationDaysRepository implements IVacationDaysRepository {
  constructor() {}

  async getVacationDays(): Promise<IVacationDay[]> {
    const res = await VacationDay.all();
    return res as IVacationDay[];
  }

  async createVacation(vacation: IVacationDay): Promise<IVacationDay> {
    const toCreate = new VacationDay();

    toCreate.fill({ ...vacation });
    await toCreate.save();
    return toCreate.serialize() as VacationDay;
  }

  async createManyVacation(vacations: IVacationDay[],trx: TransactionClientContract): Promise<IVacationDay[]> {
    const res = await VacationDay.createMany(vacations,{ client: trx })
    return res as IVacationDay[];
  }

  async updateVacationDay(
    data: IVacationDay,
  ): Promise<IVacationDay | null> {
    const toUpdate = await VacationDay.find(data.id);
    if (!toUpdate) {
      return null;
    }

    toUpdate.merge({ ...data });
    await toUpdate.save();
    return toUpdate.serialize() as VacationDay;
  }

  async updateVacationRefund(daysVacation: IEditVacation,trx: TransactionClientContract): Promise<IVacationDay | null> {
    const toUpdate = await VacationDay.findOrFail(daysVacation.idVacationDay);
    if (!toUpdate) {
      return null;
    }
    if (daysVacation.dateFrom) {
      toUpdate.dateFrom = daysVacation.dateFrom;
    }
    if (daysVacation.dateUntil) {
      toUpdate.dateUntil = daysVacation.dateUntil;
    }
    if (daysVacation.refundTypes) {
      toUpdate.refundType = daysVacation.refundTypes;
    }
    if(daysVacation.enjoyed){
      toUpdate.enjoyedDays = daysVacation.enjoyed;
    }
    if(daysVacation.observation){
      toUpdate.observation = daysVacation.observation;
    }
    (await toUpdate.save()).useTransaction(trx);
    return toUpdate.serialize() as IVacationDay;
  }
}
