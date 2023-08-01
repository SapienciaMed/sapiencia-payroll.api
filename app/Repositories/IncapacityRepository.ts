import {
  IIncapacity,
  IFilterIncapacity,
  IGetIncapacityList,
} from "App/Interfaces/IncapacityInterfaces";

import Incapacity from "App/Models/Incapacity";

import { IPagingData } from "App/Utils/ApiResponses";

export interface IIncapacityRepository {
  createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>;
  getIncapacityPaginate(
    filters: IFilterIncapacity
  ): Promise<IPagingData<IGetIncapacityList>>;
  getIncapacityById(idr: number): Promise<IGetIncapacityList | null>;
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
  ): Promise<IPagingData<IGetIncapacityList>> {
    const res = Incapacity.query();

    res.select(
      "id",
      "codIncapacityType",
      "codEmployee",
      "dateInitial",
      "dateFinish",
      "comments"
    );

    res.preload("typeIncapacity", (query) => {
      query.select("name");
    });

    res.preload("incapacityEmployee", (query) => {
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

    if (filters.idEmployee) {
      res.where("codEmployee", filters.idEmployee);
    }

    const incapacityEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = incapacityEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IGetIncapacityList[],
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
