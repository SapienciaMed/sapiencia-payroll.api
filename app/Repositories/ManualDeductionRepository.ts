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
  getManualDeductionByEmploymentId(
    employmentId: number
  ): Promise<IManualDeduction[] | null>;
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
    if (manualDeduction.totalMount !== undefined) {
      toUpdate.totalMount = manualDeduction.totalMount;
    }
    if (manualDeduction.numberInstallments !== undefined) {
      toUpdate.numberInstallments = manualDeduction.numberInstallments;
    }
    if (manualDeduction.applyExtraordinary !== undefined) {
      toUpdate.applyExtraordinary = manualDeduction.applyExtraordinary;
    }
    if (manualDeduction.porcentualValue !== undefined) {
      toUpdate.porcentualValue = manualDeduction.porcentualValue;
    }
    if (manualDeduction.codFormsPeriod !== undefined) {
      toUpdate.codFormsPeriod = manualDeduction.codFormsPeriod;
    }
    if (manualDeduction.observation !== undefined) {
      toUpdate.observation = manualDeduction.observation;
    }
    if (manualDeduction.value) {
      toUpdate.value = manualDeduction.value;
    }
    if (manualDeduction.state) {
      toUpdate.state = manualDeduction.state;
    }

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

    if (filters.typeDeduction) {
      res.where("cyclic", filters.typeDeduction == "Ciclica");
    }

    if (filters.codEmployment) {
      res.whereHas("employment", (employmentQuery) => {
        employmentQuery.where("id", filters.codEmployment);
      });
    }
    res.preload("employment", (employmentQuery) => {
      employmentQuery.preload("charges");
      if (filters.codEmployment) {
        employmentQuery.where("id", filters.codEmployment);
      }
      employmentQuery.preload("worker", (workerQuery) => {
        workerQuery.orderBy("firstName", "asc");
      });
    });

    if (filters.codFormsPeriod) {
      res.where("codFormsPeriod", filters.codFormsPeriod);
    }

    res.preload("deductionsType");
    res.preload("formsPeriod", (formPeriodQuery) => {
      formPeriodQuery.preload("formsType");
    });

    res.orderBy([
      {
        column: "state",
        order: "desc",
      },
      {
        column: "cyclic",
        order: "desc",
      },
    ]);
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

  async getManualDeductionByEmploymentId(
    employmentId: number
  ): Promise<IManualDeduction[] | null> {
    const queryManualDeduction = ManualDeduction.query();

    queryManualDeduction.where("state", "Vigente");
    queryManualDeduction.whereHas("employment", (employmentQuery) => {
      employmentQuery.where("id", employmentId);
    });
    queryManualDeduction.preload("employment", (employmentQuery) => {
      employmentQuery.where("id", employmentId);
      employmentQuery.preload("worker");
    });

    const manualDeduction = await queryManualDeduction;

    if (!manualDeduction) {
      return null;
    }

    return manualDeduction as IManualDeduction[];
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
