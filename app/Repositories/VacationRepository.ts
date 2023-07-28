import { IVacation } from "App/Interfaces/VacationsInterfaces";
import Vacation from "App/Models/Vacation";

export interface IVacationRepository {
  getVacations(): Promise<IVacation[]>;
  createVacation(vacation: IVacation): Promise<IVacation>;
  updateVacation(vacation: IVacation, id: number): Promise<IVacation | null>;
  getVacationsByParams(params): Promise<IVacation | null>;
}

export default class VacationRepository implements IVacationRepository {
  constructor() {}

  async getVacations(): Promise<IVacation[]> {
    const res = await Vacation.all();
    return res as IVacation[];
  }

  async getVacationsByParams(params): Promise<IVacation | null> {
    const res = await Vacation.query()
      .whereHas("employment", (employmentQuery) => {
        employmentQuery.whereHas("worker", (workerQuery) => {
          workerQuery.where("id", params.worker);
        });
      })
      .andWhere("period", params.period).andWhere("periodClosed",false)
      .first();
    return res ? (res.serialize() as IVacation) : null;
  }

  async createVacation(user: IVacation): Promise<IVacation> {
    const toCreate = new Vacation();

    toCreate.fill({ ...user });
    await toCreate.save();
    return toCreate.serialize() as IVacation;
  }

  async updateVacation(
    vacation: IVacation,
    id: number
  ): Promise<IVacation | null> {
    const toUpdate = await Vacation.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({ ...vacation });
    await toUpdate.save();
    return toUpdate.serialize() as IVacation;
  }
}
