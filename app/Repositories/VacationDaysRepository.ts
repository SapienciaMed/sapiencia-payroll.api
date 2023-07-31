import { IVacationDay, IVacationDayValidator } from "App/Interfaces/VacationDaysInterface";
import VacationDay from "App/Models/VacationDay";

export interface IVacationDaysRepository {
  getVacationDays(): Promise<IVacationDay[]>;
  createVacation(vacation: IVacationDay): Promise<IVacationDay>;
  updateVacation(
    vacation: IVacationDay,
    id: number
  ): Promise<IVacationDay | null>;
  createManyVacation(vacations: IVacationDayValidator) :Promise<IVacationDay[]>;
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

  async createManyVacation(vacations: IVacationDayValidator): Promise<IVacationDay[]> {
    const res = await VacationDay.createMany(vacations.vacationDay)
    return res as IVacationDay[];
  }

  async updateVacation(
    vacation: VacationDay,
    id: number
  ): Promise<VacationDay | null> {
    const toUpdate = await VacationDay.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({ ...vacation });
    await toUpdate.save();
    return toUpdate.serialize() as VacationDay;
  }
}
