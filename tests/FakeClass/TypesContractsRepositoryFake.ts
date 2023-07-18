import { ITypesContracts } from "App/Interfaces/TypesContractsInterfaces";
import TypesContractsRepository from "App/Repositories/TypesContractsRepository";

const typeContractFake: ITypesContracts = {
  id: 1,
  name: "Contratista",
  temporary: true,
};

export class TypesContractsRepositoryFake implements TypesContractsRepository {
  getTypeContractsById(id: number): Promise<ITypesContracts | null> {
    const list = [{ ...typeContractFake }];

    return new Promise((res) => {
      const typeContract = list.find((typeContract) => typeContract.id === id);

      if (!typeContract) {
        return res(null);
      }

      return res(typeContract);
    });
  }

  async getTypesContractsList(): Promise<ITypesContracts[]> {
    const list = [{ ...typeContractFake }];

    return new Promise((res) => {
      return res(list);
    });
  }
}
