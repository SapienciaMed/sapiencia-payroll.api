import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { ISalaryHistory } from "App/Interfaces/SalaryHistoryInterfaces";
import { ISalaryIncrementsFilters } from "App/Interfaces/SalaryIncrementInterfaces";
import SalaryHistoryRepository from "App/Repositories/SalaryHistoryRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const salaryHistoryFake: ISalaryHistory = {
  codEmployment: 1,
  codIncrement: 1,
  previousSalary: 10.0,
  salary: 12.0,
  validity: true,
  effectiveDate: DateTime.fromISO("02/08/2023"),
};

export class SalaryHistoryRepositoryFake implements SalaryHistoryRepository {
  createSalaryHistory(_salaryHistory: ISalaryHistory): Promise<ISalaryHistory> {
    return Promise.resolve(salaryHistoryFake);
  }
  createManySalaryHistory(
    _salaryHistories: ISalaryHistory[],
    _trx: TransactionClientContract
  ): Promise<boolean> {
    return Promise.resolve(!!salaryHistoryFake);
  }
  updateManySalaryHistory(
    _salaryHistories: ISalaryHistory[],
    _trx: TransactionClientContract
  ): Promise<boolean> {
    const list = [salaryHistoryFake];
    const salaryHistory = Promise.resolve(
      !!list.find((i) => i.id == _salaryHistories[0].id)
    );
    return salaryHistory;
  }
  updateStatusSalaryHistory(_chargeId: number): Promise<boolean> {
    const list = [salaryHistoryFake];
    const salaryHistory = Promise.resolve(
      !!list.find((i) => i.id == _chargeId)
    );
    return salaryHistory;
  }
  getSalaryHistories(_idSalaryIncrement: number): Promise<ISalaryHistory[]> {
    const list = [salaryHistoryFake];
    return Promise.resolve(
      list.filter((i) => i.codIncrement == _idSalaryIncrement)
    );
  }
  getSalaryHistoriesPaginate(
    _filters: ISalaryIncrementsFilters
  ): Promise<IPagingData<ISalaryHistory>> {
    return Promise.resolve({
      array: [salaryHistoryFake],
      meta: { total: 100 },
    });
  }
}
