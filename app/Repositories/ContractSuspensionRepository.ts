import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import {
  IFilterContractSuspension,
  IcontractSuspension,
} from "App/Interfaces/ContractSuspensionInterfaces";
import ContractSuspension from "App/Models/ContractSuspension";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

export interface IContractSuspensionRepository {
  createContractSuspension(
    contractSuspension: IcontractSuspension,
    trx: TransactionClientContract
  ): Promise<IcontractSuspension>;
  getContractSuspensionPaginate(
    filters: IFilterContractSuspension
  ): Promise<IPagingData<IcontractSuspension>>;
  getContractSuspensionBetweenDate(
    codEmployment: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<IcontractSuspension[]>;
}

export default class ContractSuspensionRepository
  implements IContractSuspensionRepository
{
  constructor() {}
  async createContractSuspension(
    contractSuspension: IcontractSuspension,
    trx: TransactionClientContract
  ): Promise<IcontractSuspension> {
    const toCreate = new ContractSuspension().useTransaction(trx);

    toCreate.fill({ ...contractSuspension });
    await toCreate.save();
    return toCreate.serialize() as IcontractSuspension;
  }

  async getContractSuspensionPaginate(
    filters: IFilterContractSuspension
  ): Promise<IPagingData<IcontractSuspension>> {
    const res = ContractSuspension.query();

    if (filters.codEmployment) {
      res.whereHas("employment", (employmentQuery) => {
        if (filters.codEmployment) {
          employmentQuery.where("id", filters.codEmployment);
        }
      });
    }
    res.preload("employment", (employmentQuery) => {
      employmentQuery.preload("charges");
      if (filters.codEmployment) {
        employmentQuery.where("id", filters.codEmployment);
      }
      employmentQuery.preload("worker");
      employmentQuery.preload("typesContracts")
    });

    const workerEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = workerEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IcontractSuspension[],
      meta,
    };
  }

  async getContractSuspensionBetweenDate(
    codEmployment: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ): Promise<IcontractSuspension[]> {
    const contractSuspensionFind = await ContractSuspension.query()
      .where("codEmployment", codEmployment)
      .andWhereBetween("dateStart", [dateStart.toString(), dateEnd.toString()])
      .andWhereBetween("dateEnd", [dateStart.toString(), dateEnd.toString()]);

    return contractSuspensionFind as IcontractSuspension[];
  }
}
