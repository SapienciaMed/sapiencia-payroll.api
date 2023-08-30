import {
  IcontractSuspension,
  IFilterContractSuspension,
} from "App/Interfaces/ContractSuspensionInterfaces";
import ContractSuspensionRepository from "App/Repositories/ContractSuspensionRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

export class ContractSuspensionRepositoryFake
  implements ContractSuspensionRepository
{
  createContractSuspension(
    _contractSuspension: IcontractSuspension
  ): Promise<IcontractSuspension> {
    throw new Error("Method not implemented.");
  }
  getContractSuspensionPaginate(
    _filters: IFilterContractSuspension
  ): Promise<IPagingData<IcontractSuspension>> {
    throw new Error("Method not implemented.");
  }
  getContractSuspensionBetweenDate(
    _codEmployment: number,
    _dateStart: DateTime,
    _dateEnd: DateTime
  ): Promise<IcontractSuspension[]> {
    throw new Error("Method not implemented.");
  }
}
