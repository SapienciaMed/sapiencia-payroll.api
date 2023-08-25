import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import {
  IEditVacation,
  IVacationDayValidator,
} from "App/Interfaces/VacationDaysInterface";
import {
  IVacation,
  IVacationFilters,
  IVacationSearchParams,
} from "App/Interfaces/VacationsInterfaces";
import Vacation from "App/Models/Vacation";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IVacationRepository {
  getVacations(): Promise<IVacation[]>;
  createVacation(vacation: IVacation): Promise<IVacation>;
  updateVacation(
    daysVacation: IEditVacation,
    trx: TransactionClientContract
  ): Promise<IVacation | null>;
  updateVacationDays(
    daysVacation: IVacationDayValidator
  ): Promise<IVacation | null>;
  getVacationsByParams(
    params: IVacationSearchParams
  ): Promise<IVacation | null>;
  getVacation(filters: IVacationFilters): Promise<IPagingData<IVacation>>;
}

export default class VacationRepository implements IVacationRepository {
  constructor() {}

  async getVacations(): Promise<IVacation[]> {
    const res = await Vacation.all();
    return res as IVacation[];
  }

  async getVacationsByParams(
    params: IVacationSearchParams
  ): Promise<IVacation | null> {
    const res = await Vacation.query()
      .whereHas("employment", (employmentQuery) => {
        employmentQuery.where("id", params.workerId);
      })
      .andWhere("period", params.period)
      .andWhere("periodClosed", false)
      .preload("vacationDay")
      .preload("employment", (employmentQuery) => {
        employmentQuery.preload("worker");
      })
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
      if (filters.workerId) {
        employmentQuery.where("id", filters.workerId);
      }
    });

    res.preload("employment", (employmentQuery) => {
      employmentQuery.preload("charges");
      if (filters.workerId) {
        employmentQuery.where("id", filters.workerId);
      }
      employmentQuery.preload("worker");
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
    daysVacation: IEditVacation,
    trx: TransactionClientContract
  ): Promise<IVacation | null> {
    const toUpdate = await Vacation.findOrFail(daysVacation.id);
    if (!toUpdate) {
      return null;
    }
    if (daysVacation.enjoyed) {
      toUpdate.enjoyed = daysVacation.enjoyed;
    }
    if (daysVacation.available) {
      toUpdate.available = daysVacation.available;
    }
    if(daysVacation.days){
      toUpdate.days = daysVacation.days
    }
    if (daysVacation.refund) {
      toUpdate.refund = daysVacation.refund;
    }
    (await toUpdate.save()).useTransaction(trx);
    return toUpdate.serialize() as IVacation;
  }

  async updateVacationDays(
    daysVacation: IVacationDayValidator
  ): Promise<IVacation | null> {
    const toUpdate = await Vacation.findOrFail(daysVacation.periodId);
    if (!toUpdate) {
      return null;
    }
    if (daysVacation.enjoyedDays) {
      toUpdate.enjoyed += daysVacation.enjoyedDays;
    }
    if (typeof daysVacation.avaibleDays === "number") {
      toUpdate.available = daysVacation.avaibleDays;
    }
    if (typeof daysVacation.refundDays === "number") {
      toUpdate.refund = daysVacation.refundDays;
    }
    if (typeof daysVacation.formedDays === "number") {
      toUpdate.periodFormer = daysVacation.formedDays;
    }
    await toUpdate.save();
    return toUpdate.serialize() as IVacation;
  }
}
