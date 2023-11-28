import {
  IFormPeriod,
  IFormPeriodFilters,
} from "App/Interfaces/FormPeriodInterface";
import { IFormTypes } from "App/Interfaces/FormTypesInterface";
import FormsPeriod from "App/Models/FormsPeriod";
import FormsType from "App/Models/FormsType";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IFormPeriodRepository {
  createFormPeriod(formPeriod: IFormPeriod): Promise<IFormPeriod>;
  getFormTypes(): Promise<IFormTypes[]>;
  getLastPeriods(temporary: boolean): Promise<IFormPeriod[]>;
  getFormPeriod(): Promise<IFormPeriod[] | null>;
  updateFormPeriod(
    formPeriod: IFormPeriod,
    id: number
  ): Promise<IFormPeriod | null>;
  getFormPeriodById(id: number): Promise<IFormPeriod | null>;
  getFormsPeriodPaginate(
    filters: IFormPeriodFilters
  ): Promise<IPagingData<IFormPeriod>>;
}

export default class FormPeriodRepository implements IFormPeriodRepository {
  constructor() {}
  async createFormPeriod(formPeriod: IFormPeriod): Promise<IFormPeriod> {
    const toCreate = new FormsPeriod();

    toCreate.fill({ ...formPeriod, userCreate: undefined });
    await toCreate.save();
    return toCreate.serialize() as IFormPeriod;
  }

  async updateFormPeriod(
    formPeriod: IFormPeriod,
    id: number
  ): Promise<IFormPeriod | null> {
    const toUpdate = await FormsPeriod.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({ ...toUpdate, ...formPeriod, userModified: undefined });

    await toUpdate.save();

    return toUpdate.serialize() as IFormPeriod;
  }

  async getFormTypes(): Promise<IFormTypes[]> {
    const res = await FormsType.all();
    return res as IFormTypes[];
  }

  async getLastPeriods(temporary: boolean): Promise<IFormPeriod[]> {
    const res = FormsPeriod.query().whereIn("state", ["Pendiente", "Generada"]);

    res.whereHas("formsType", (formTypeQuery) => {
      if (temporary) {
        formTypeQuery.where("name", "Mensual");
      } else {
        formTypeQuery.where("name", "Quincenal");
      }
    });
    res.preload("formsType", (formTypeQuery) => {
      if (temporary) {
        formTypeQuery.where("name", "Mensual");
      } else {
        formTypeQuery.where("name", "Quincenal");
      }
    });
    const result = await res;
    return result.map((i) => i.serialize() as IFormPeriod);
  }

  async getFormPeriod(): Promise<IFormPeriod[] | null> {
    const res = FormsPeriod.query();
    res.preload("formsType", (formTypeQuery) => {
      formTypeQuery.whereIn("name", ["Quincenal", "Mensual"]);
    });
    const result = await res.orderBy("dateStart", "asc");
    return result.map((i) => i.serialize() as IFormPeriod);
  }

  async getFormPeriodById(id: number): Promise<IFormPeriod | null> {
    const queryFormPeriod = FormsPeriod.query().where("id", id);
    queryFormPeriod.preload("formsType");
    const formPeriod = await queryFormPeriod.first();

    if (!formPeriod) {
      return null;
    }

    return formPeriod.serialize() as IFormPeriod;
  }

  async getFormsPeriodPaginate(
    filters: IFormPeriodFilters
  ): Promise<IPagingData<IFormPeriod>> {
    const res = FormsPeriod.query();

    if (filters.idFormType) {
      res.where("idFormType", filters.idFormType);
    }
    if (filters.state) {
      res.where("state", "=", filters.state);
    }
    if (filters.paidDate) {
      res.where("paidDate", "=", new Date(filters.paidDate.toString()));
    }
    res.preload("formsType");
    console.log(res.toQuery());
    const formPeriodPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = formPeriodPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IFormPeriod[],
      meta,
    };
  }
}
