import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import { IManualDeduction } from "App/Interfaces/ManualDeductionsInterfaces";
import DeductionsType from "App/Models/DeductionsType";
import ManualDeduction from "App/Models/ManualDeduction";

export interface IManualDeductionRepository {
  createManualDeduction(
    manualDeduction: IManualDeduction
  ): Promise<IManualDeduction>;
  getDeductionTypes(): Promise<IDeductionType[]>;
  getManualDeductionById(id: number): Promise<IManualDeduction[] | null>;
  getDeductionTypesByType(type: string): Promise<IDeductionType[]>;
}

export default class manualDeductionRepository
  implements IManualDeductionRepository
{
  constructor() {}

  async createManualDeduction(
    manualDeduction: IManualDeduction
  ): Promise<IManualDeduction> {
    const toCreate = new ManualDeduction();

    toCreate.fill({ ...manualDeduction });
    await toCreate.save();
    return toCreate.serialize() as IManualDeduction;
  }

  async getDeductionTypes(): Promise<IDeductionType[]> {
    const deductionTypes = await DeductionsType.all();
    return deductionTypes as IDeductionType[];
  }
  async getDeductionTypesByType(type: string): Promise<IDeductionType[]> {
    const deductionTypes = await DeductionsType.query().where("type", type);
    return deductionTypes as IDeductionType[];
  }

  async getManualDeductionById(id: number): Promise<IManualDeduction[] | null> {
    const queryManualDeduction = ManualDeduction.query().where("id", id);

    queryManualDeduction.preload("deductionsType");

    queryManualDeduction.preload("employment", (employmentQuery) => {
      employmentQuery.preload("worker");
    });

    const manualDeduction = await queryManualDeduction;

    if (!manualDeduction) {
      return null;
    }

    return manualDeduction as IManualDeduction[];
  }
}
