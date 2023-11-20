import {
  IFilterTaxDeductible,
  IGetTaxDeductible,
  ITaxDeductible,
} from "App/Interfaces/TaxDeductibleInterfaces";
import TaxDeductible from "App/Models/TaxDeductible";
import { IPagingData } from "App/Utils/ApiResponses";

export interface ITaxDeductibleRepository {
  getTaxDeductibleById(id: number): Promise<ITaxDeductible | null>;
  createTaxDeductible(data: ITaxDeductible): Promise<ITaxDeductible>;
  getTaxDeductiblePaginate(
    filters: IFilterTaxDeductible
  ): Promise<IPagingData<IGetTaxDeductible>>;
  updateTaxDeductible(data: ITaxDeductible): Promise<ITaxDeductible | null>;
}

export default class TaxDeductibleRepository
  implements ITaxDeductibleRepository
{
  constructor() {}

  async getTaxDeductiblePaginate(
    filters: IFilterTaxDeductible
  ): Promise<IPagingData<IGetTaxDeductible>> {
    const res = TaxDeductible.query();

    if (filters.codEmployment) {
      res.where("codEmployment", filters.codEmployment);
    }

    if (filters.year) {
      res.where("year", filters.year);
    }

    res.preload("employment", (employmentQuery) => {
      employmentQuery.preload("worker");
    });

    const taxDeductionsPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = taxDeductionsPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IGetTaxDeductible[],
      meta,
    };
  }

  async getTaxDeductibleById(id: number): Promise<ITaxDeductible | null> {
    const res = await TaxDeductible.find(id);

    return res ? (res.serialize() as ITaxDeductible) : null;
  }

  async createTaxDeductible(data: ITaxDeductible): Promise<ITaxDeductible> {
    const toCreate = new TaxDeductible();

    toCreate.fill({
      ...data,
      userCreate: undefined,
    });

    await toCreate.save();

    return toCreate.serialize() as ITaxDeductible;
  }

  async updateTaxDeductible(
    data: ITaxDeductible
  ): Promise<ITaxDeductible | null> {
    const toUpdate = await TaxDeductible.findBy("id", data.id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({
      ...toUpdate,
      ...data,
      userModified: undefined,
    });

    await toUpdate.save();

    return toUpdate.serialize() as ITaxDeductible;
  }
}
