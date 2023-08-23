import { IcontractSuspension } from "App/Interfaces/ContractSuspensionInterfaces";
import ContractSuspension from "App/Models/ContractSuspension";

export interface IContractSuspensionRepository {
  createContractSuspension(
    contractSuspension: IcontractSuspension
  ): Promise<IcontractSuspension>;
}

export default class ContractSuspensionRepository
  implements IContractSuspensionRepository
{
  constructor() {}
  async createContractSuspension(
    contractSuspension: IcontractSuspension
  ): Promise<IcontractSuspension> {
    const toCreate = new ContractSuspension();

    toCreate.fill({ ...contractSuspension });
    await toCreate.save();
    return toCreate.serialize() as IcontractSuspension;
  }
}
