import {
  IOtherIncome,
  IGetOtherIncome,
  IFilterOtherIncome,
} from "App/Interfaces/OtherIncomeInterfaces";

import OtherIncome from "App/Models/OtherIncome";

import { IPagingData } from "App/Utils/ApiResponses";

export interface IOtherIncomeRepository {
  getOtherIncomePaginate(
    filters: IFilterOtherIncome
  ): Promise<IPagingData<IGetOtherIncome>>;
  getOtherIncomeById(id: number): Promise<IOtherIncome | null>;
  createOtherIncome(data: IOtherIncome): Promise<IOtherIncome>;
  updateOtherIncome(data: IOtherIncome): Promise<IOtherIncome | null>;
}

export default class OtherIncomeRepository implements IOtherIncomeRepository {
  constructor() {}

  async getOtherIncomePaginate(
    filters: IFilterOtherIncome
  ): Promise<IPagingData<IGetOtherIncome>> {

    const res = OtherIncome.query();

    if (filters.codEmployment) {
      res.where("codEmployment", filters.codEmployment);
    }

    if (filters.codPayroll) {
      res.where("codPayroll", filters.codPayroll);
    }

    res.preload("employment", (employmentQuery) => {
      employmentQuery.preload("worker");
    });

    res.preload("incomeType");

    const taxDeductionsPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = taxDeductionsPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IGetOtherIncome[],
      meta,
    };
  }

  async getOtherIncomeById(id: number): Promise<IOtherIncome | null> {
    const res = await OtherIncome.find(id);

    return res ? (res.serialize() as IOtherIncome) : null;
  }

  async createOtherIncome(data: IOtherIncome): Promise<IOtherIncome> {
    const toCreate = new OtherIncome();

    toCreate.fill({
      ...data,
    });

    await toCreate.save();

    return toCreate.serialize() as IOtherIncome;
  }

  async updateOtherIncome(data: IOtherIncome): Promise<IOtherIncome | null> {
    const toUpdate = await OtherIncome.findBy("id", data.id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({
      ...toUpdate,
      ...data,
    });

    await toUpdate.save();

    return toUpdate.serialize() as IOtherIncome;
  }
}
