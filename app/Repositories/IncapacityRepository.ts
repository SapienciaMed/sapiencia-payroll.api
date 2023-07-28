<<<<<<< HEAD
import {
  IIncapacity,
  IIncapacityFilters,
} from "App/Interfaces/IncapacityInterfaces";
import Incapacity from "App/Models/Incapacity";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IIncapacityRepository {
  getIncapacitiesPaginated(
    filters: IIncapacityFilters
  ): Promise<IPagingData<IIncapacity>>;
  createIncapacity(data: IIncapacity): Promise<IIncapacity>;
  updateIncapacity(data: IIncapacity, id: number): Promise<IIncapacity | null>;
  deleteIncapacity(id: number): Promise<boolean>;
}

export default class IncapacityRepository implements IIncapacityRepository {
  constructor() {}
  async createIncapacity(data: IIncapacity): Promise<IIncapacity> {
    const toCreate = new Incapacity();

    toCreate.fill({ ...data });
    await toCreate.save();

    return toCreate.serialize() as IIncapacity;
  }

  async updateIncapacity(
    data: IIncapacity,
    id: number
  ): Promise<IIncapacity | null> {
    const toEdit = await Incapacity.find(id);

    if (!toEdit) {
      return null;
    }

    toEdit.fill({ ...data });
    await toEdit.save();

    return toEdit.serialize() as IIncapacity;
  }

  async deleteIncapacity(id: number): Promise<boolean> {
    return true;
  }

  async getIncapacitiesPaginated(
    filters: IIncapacityFilters
  ): Promise<IPagingData<IIncapacity>> {
    const query = Incapacity.query();

    if (filters.employmentId) {
      query.where("employmentId", filters.employmentId);
    }

    const res = await query.paginate(filters.page, filters.perPage);

    const { data, meta } = res.serialize();

    return {
      array: data as Incapacity[],
      meta,
    };
  }
=======
import { IIncapacity } from "App/Interfaces/IncapacityInterfaces";
import Incapacity from "App/Models/Incapacity";

export interface IIncapacityRepository {
  createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>
}

export default class IncapacityRepository implements IIncapacityRepository {

  constructor() { }

  async createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>{

    // console.log("incapacity desde repository = " , incapacity);

    const toCreate = new Incapacity();
    toCreate.fill({ ...incapacity });

    // console.log("************ >")
    console.log(toCreate.save());

    await toCreate.save();

    return toCreate.serialize() as IIncapacity;

  }

>>>>>>> S3-NOM014
}
