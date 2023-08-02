import {
  IIncapacity,
  IFilterIncapacity,
  IGetIncapacity,
} from "App/Interfaces/IncapacityInterfaces";

import Incapacity from "App/Models/Incapacity";

import { IPagingData } from "App/Utils/ApiResponses";

export interface IIncapacityRepository {
  createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>;
  getIncapacityPaginate(filters: IFilterIncapacity): Promise<IPagingData<IGetIncapacityList>>;
  getIncapacityById(idr: number): Promise<IGetIncapacityList | null>;
  updateIncapacity(incapacity: IIncapacity, id: number): Promise<IIncapacity | null>;
}

export default class IncapacityRepository implements IIncapacityRepository {
  constructor() {}

  async createIncapacity(incapacity: IIncapacity): Promise<IIncapacity> {
    const toCreate = new Incapacity();
    toCreate.fill({ ...incapacity });

    await toCreate.save();
    return toCreate.serialize() as IIncapacity;
  }

  async getIncapacityPaginate(
    filters: IFilterIncapacity
  ): Promise<IPagingData<IGetIncapacity>> {
    const res = Incapacity.query();

    const { workerId } = filters;

    if (workerId) {
      res.whereHas("employment", (queryEmployment) => {
        queryEmployment.where("workerId", workerId);
      });
    }

    res.preload("typeIncapacity");

    res.preload("employment", (queryEmployment) => {
      queryEmployment
        .select("id", "workerId")
        .preload("worker", (queryWorker) => {
          queryWorker.select(
            "id",
            "typeDocument",
            "numberDocument",
            "firstName",
            "secondName",
            "surname",
            "secondSurname"
          );

          if (workerId) {
            queryWorker.where("id", workerId);
          }
        });
    });

    const incapacityEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = incapacityEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IGetIncapacity[],
      meta,
    };
  }

  //?BUSCAR INCAPACIDAD POR ID - Relacional
  async getIncapacityById(id: number): Promise<IGetIncapacityList | null> {
    const res = await Incapacity.find(id);

    await res!.load("typeIncapacity", (query) => {
      query.select("name");
    });

    await res!.load("incapacityEmployee", (query) => {
      query.select("id", "workerId", "institutionalMail");
      query.preload("workerEmployment", (query) => {
        query.select(
          "id",
          "typeDocument",
          "numberDocument",
          "firstName",
          "secondName",
          "surname",
          "secondSurname"
        );
      });
    });

    return res ? (res.serialize() as IGetIncapacityList) : null;
  }
}
