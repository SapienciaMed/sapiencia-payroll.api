import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import {
  IManualDeduction,
  IManualDeductionFilters,
} from "App/Interfaces/ManualDeductionsInterfaces";
import DeductionsType from "App/Models/DeductionsType";
import ManualDeduction from "App/Models/ManualDeduction";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IManualDeductionRepository {
  createManualDeduction(
    manualDeduction: IManualDeduction
  ): Promise<IManualDeduction>;
  getDeductionTypes(): Promise<IDeductionType[]>;
  getManualDeductionById(id: number): Promise<IManualDeduction[] | null>;
  getDeductionTypesByType(type: string): Promise<IDeductionType[]>;
  getManualDeductionPaginate(
    filters: IManualDeductionFilters
  ): Promise<IPagingData<IManualDeduction>>;
  updateManualDeduction(
    manualDeduction: IManualDeduction,
    id: number
  ): Promise<IManualDeduction | null>;
}

export default class ManualDeductionRepository
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

  async updateManualDeduction(
    manualDeduction: IManualDeduction,
    id: number
  ): Promise<IManualDeduction | null> {
    const toUpdate = await ManualDeduction.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({ ...manualDeduction });

    await toUpdate.save();

    return toUpdate.serialize() as IManualDeduction;
  }

  async getDeductionTypes(): Promise<IDeductionType[]> {
    const deductionTypes = await DeductionsType.all();
    return deductionTypes as IDeductionType[];
  }
  async getDeductionTypesByType(type: string): Promise<IDeductionType[]> {
    const deductionTypes = await DeductionsType.query().where("type", type);
    return deductionTypes as IDeductionType[];
  }

  async getManualDeductionPaginate(
    filters: IManualDeductionFilters
  ): Promise<IPagingData<IManualDeduction>> {
    const res = ManualDeduction.query();
    const addEmploymentConditions = (query: any) => {
      query.preload("employment", (employmentQuery) => {
        employmentQuery.preload("charges");
        if (filters.codEmployment) {
          employmentQuery.where("id", filters.codEmployment);
        }
        employmentQuery.preload("worker");
      });
    };
    const addDeductionsTypeConditions = (query: any) => {
      query.preload("deductionsType", (deductionTypeQuery) => {
        if (filters.type) {
          deductionTypeQuery.where("type", filters.type);
        }
      });
    };

    if (filters.codEmployment) {
      res.whereHas("employment", (employmentQuery) => {
        employmentQuery.where("id", filters.codEmployment);
      });
    }

    if (filters.codFormsPeriod) {
      res.where("codFormsPeriod", filters.codFormsPeriod);
    }

    if (filters.type) {
      res.whereHas("deductionsType", (deductionTypeQuery) => {
        if (filters.type) {
          deductionTypeQuery.where("type", filters.type);
        }
      });
    }
    addEmploymentConditions(res);
    addDeductionsTypeConditions(res);

    const workerEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = workerEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IManualDeduction[],
      meta,
    };
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
