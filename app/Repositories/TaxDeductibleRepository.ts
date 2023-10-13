import { ITaxDeductible } from "App/Interfaces/TaxDeductibleInterfaces";
import TaxDeductible from "App/Models/TaxDeductible";

export interface ITaxDeductibleRepository {
  getTaxDeductibleById(id: number): Promise<ITaxDeductible | null>;
  createTaxDeductible(data: ITaxDeductible): Promise<ITaxDeductible>;
}

export default class TaxDeductibleRepository
  implements ITaxDeductibleRepository
{
  constructor() {}

  async getTaxDeductibleById(id: number): Promise<ITaxDeductible | null> {
    const res = await TaxDeductible.find(id);


    return res ? (res.serialize() as ITaxDeductible) : null;
  }

  async createTaxDeductible(data: ITaxDeductible): Promise<ITaxDeductible> {
      const toCreate = new TaxDeductible()
      toCreate.fill({
        ...data
      })
      await toCreate.save()
      return toCreate.serialize() as ITaxDeductible
  }
}
