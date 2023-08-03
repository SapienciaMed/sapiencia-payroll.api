import {
  IIncapacity,
  IFilterIncapacity,
  IGetIncapacity,
} from "App/Interfaces/IncapacityInterfaces";

import Incapacity from "App/Models/Incapacity";

import { IPagingData } from "App/Utils/ApiResponses";

export interface IIncapacityRepository {
  createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>;
  getIncapacityPaginate(
    filters: IFilterIncapacity
  ): Promise<IPagingData<IGetIncapacity>>;
  getIncapacityById(idr: number): Promise<IGetIncapacity | null>;
  updateIncapacity(
    incapacity: IIncapacity,
    id: number
  ): Promise<IIncapacity | null>;
}

export default class IncapacityRepository implements IIncapacityRepository {
  constructor() {}

  //?CREAR INCAPACIDAD
  async createIncapacity(incapacity: IIncapacity): Promise<IIncapacity> {
    const toCreate = new Incapacity();
    toCreate.fill({ ...incapacity });

    await toCreate.save();
    return toCreate.serialize() as IIncapacity;
  }

  //?BUSCAR INCAPACIDAD PAGINADO -LISTADO RELACIONAL

  async getIncapacityPaginate(
    filters: IFilterIncapacity
  ): Promise<IPagingData<IGetIncapacity>> {
    const res = Incapacity.query();

    const { workerId } = filters;

    if (workerId) {
      res.whereHas("employment", (queryEmployment) => {
        queryEmployment.where("id", workerId);
      });
    }

    res.preload("typeIncapacity");

    res.preload("employment", (queryEmployment) => {
      queryEmployment.select("id", "workerId");

      if (workerId) queryEmployment.where("id", workerId);

      queryEmployment.preload("worker", (queryWorker) => {
        queryWorker.select(
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
  async getIncapacityById(id: number): Promise<IGetIncapacity | null> {
    const res = await Incapacity.find(id);

    await res!.load("typeIncapacity", (query) => {
      query.select("name");
    });

    await res!.load("employment", (queryEmployment) => {
      queryEmployment.select("id", "workerId");

      queryEmployment.preload("worker", (queryWorker) => {
        queryWorker.select(
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

    return res ? (res.serialize() as IGetIncapacity) : null;
  }

  //?ACTUALIZAR INCAPACIDAD - ID Y ELEMENTOS POR BODY
  async updateIncapacity(
    incapacity: IIncapacity,
    id: number
  ): Promise<IIncapacity | null> {
    const toUpdate = await Incapacity.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({ ...incapacity });

    await toUpdate.save();

    return toUpdate.serialize() as Incapacity;
  }
}
