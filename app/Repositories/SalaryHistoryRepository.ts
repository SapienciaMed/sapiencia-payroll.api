import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { ISalaryHistory } from "App/Interfaces/SalaryHistoryInterfaces";
import { ISalaryIncrementsFilters } from "App/Interfaces/SalaryIncrementInterfaces";
import SalaryHistory from "App/Models/SalaryHistory";
import { IPagingData } from "App/Utils/ApiResponses";

export interface ISalaryHistoryRepository {
  createSalaryHistory(salaryHistory: ISalaryHistory): Promise<ISalaryHistory>;
  createManySalaryHistory(
    salaryHistories: ISalaryHistory[],
    trx: TransactionClientContract
  ): Promise<boolean>;
  updateManySalaryHistory(
    salaryHistories: ISalaryHistory[],
    trx: TransactionClientContract
  ): Promise<boolean> 
  getSalaryHistories(idSalaryIncrement: number): Promise<ISalaryHistory[]>;
  getSalaryHistoriesPaginate(
    filters: ISalaryIncrementsFilters
  ): Promise<IPagingData<ISalaryHistory>>;
}

export default class SalaryHistoryRepository
  implements ISalaryHistoryRepository
{
  constructor() {}
  async createSalaryHistory(
    salaryHistory: ISalaryHistory
  ): Promise<ISalaryHistory> {
    const toCreate = new SalaryHistory();

    toCreate.fill({ ...salaryHistory });
    await toCreate.save();
    return toCreate.serialize() as ISalaryHistory;
  }

  async createManySalaryHistory(
    salaryHistories: ISalaryHistory[],
    trx: TransactionClientContract
  ): Promise<boolean> {
    await SalaryHistory.createMany(salaryHistories, { client: trx });
    return true;
  }

  async updateManySalaryHistory(
    salaryHistories: ISalaryHistory[],
    trx: TransactionClientContract
  ): Promise<boolean> {
    await SalaryHistory.updateOrCreateMany("codIncrement", salaryHistories, {
      client: trx,
    });
    return true;
  }
  async getSalaryHistories(
    idSalaryIncrement: number
  ): Promise<ISalaryHistory[]> {
    const res = await SalaryHistory.query().where(
      "codIncrement",
      idSalaryIncrement
    );
    return res as ISalaryHistory[];
  }

  async getSalaryHistoriesPaginate(
    filters: ISalaryIncrementsFilters
  ): Promise<IPagingData<ISalaryHistory>> {
    const res = SalaryHistory.query();

    res.whereHas("salaryIncrement", (salaryIncrementQuery) => {
      if (filters.codCharge) {
        salaryIncrementQuery.where("codCharge", filters.codCharge);
      }

      if (filters.numberActApproval) {
        salaryIncrementQuery.whereILike(
          "numberActApproval",
          `%${filters.numberActApproval}%`
        );
      }
    });
    res.preload("salaryIncrement", (salaryIncrementQuery) => {
      if (filters.codCharge) {
        salaryIncrementQuery.where("codCharge", filters.codCharge);
      }

      if (filters.numberActApproval) {
        salaryIncrementQuery.whereILike(
          "numberActApproval",
          `%${filters.numberActApproval}%`
        );
      }
      salaryIncrementQuery.preload("charge");
    });

    res.preload("employment", (employmentQuery) => {
      employmentQuery.where("state",1)
      employmentQuery.preload("worker");
    });

    const workerEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = workerEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as ISalaryHistory[],
      meta,
    };
  }
}
