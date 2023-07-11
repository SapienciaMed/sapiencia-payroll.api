import { ITypesContracts } from "App/Interfaces/TypesContractsInterfaces";
import TypesContract from "App/Models/TypesContract";

export interface ITypesContractsRepository {
  getTypeContractsById(id: number): Promise<ITypesContracts | null>;
  getTypesContractsList(): Promise<ITypesContracts[]>;
}

export default class TypesContractsRepository implements ITypesContractsRepository {
  constructor() {}
  async getTypeContractsById(id: number): Promise<ITypesContracts | null> {
    const res = await TypesContract.find(id);
    return res ? (res.serialize() as ITypesContracts) : null;
  }

  async getTypesContractsList(): Promise<ITypesContracts[]> {
    const res = await TypesContract.all();
    return res as ITypesContracts[]
  }
}
