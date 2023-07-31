import {
  IVacation,
  IVacationFilters,
} from "App/Interfaces/VacationsInterfaces";
import Vacation from "App/Models/Vacation";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IVacationRepository {
  getVacations(): Promise<IVacation[]>;
  createVacation(vacation: IVacation): Promise<IVacation>;
  updateVacation(vacation: IVacation, id: number): Promise<IVacation | null>;
  getVacationsByParams(params): Promise<IVacation | null>;
  getVacation(filters: IVacationFilters): Promise<IPagingData<IVacation>>;
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
          workerQuery.where("id", params.workerId);
        });
      })
      .andWhere("period", params.period)
      .andWhere("periodClosed", false)
      .first();
    return res ? (res.serialize() as IVacation) : null;
  }

  async getVacation(
    filters: IVacationFilters
  ): Promise<IPagingData<IVacation>> {
    const res = Vacation.query();

    if (filters.period) {
      res.where("period", filters.period);
    }
    res.preload("vacationDay");
    res.whereHas("employment", (employmentQuery) => {
      employmentQuery.whereHas("worker", (workerQuery) => {
        if (filters.workerId) {
          workerQuery.where("id", filters.workerId);
        }
      });
    });
    res.preload("employment", (employmentQuery) => {
      employmentQuery.preload("charges");
      employmentQuery.preload("worker", (workerQuery) => {
        if (filters.workerId) {
          workerQuery.where("id", filters.workerId);
        }
      });
    });

    const workerEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = workerEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IVacation[],
      meta,
    };
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
