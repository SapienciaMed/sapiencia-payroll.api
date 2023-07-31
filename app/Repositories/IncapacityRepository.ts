import { IIncapacity, IFilterIncapacity, IGetIncapacity } from "App/Interfaces/IncapacityInterfaces";
import Incapacity from "App/Models/Incapacity";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IIncapacityRepository {
  createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>;
  getIncapacity( filters: IFilterIncapacity ): Promise<IPagingData<IGetIncapacity>>;
}

export default class IncapacityRepository implements IIncapacityRepository {

  constructor() { }

  async createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>{

    const toCreate = new Incapacity();
    toCreate.fill({ ...incapacity });

    await toCreate.save();
    return toCreate.serialize() as IIncapacity;

  }

  async getIncapacity( filters: IFilterIncapacity ): Promise<IPagingData<IGetIncapacity>> {

    const res = Incapacity.query();

    if (filters.idEmployee) {
      res.where("codEmployee", filters.idEmployee);
    }

    const incapacityEmploymentPaginated = await res.paginate( filters.page, filters.perPage );

    const { data, meta } = incapacityEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IGetIncapacity[],
      meta,
    };
  }



}
