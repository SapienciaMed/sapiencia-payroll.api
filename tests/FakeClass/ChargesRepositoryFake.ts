import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { ICharge, IChargeFilters } from "App/Interfaces/ChargeInterfaces";
import { ITypesCharges } from "App/Interfaces/TypesChargesInterfaces";
import ChargesRepository from "App/Repositories/ChargesRepository";
import { IPagingData } from "App/Utils/ApiResponses";

const chargeFake: ICharge = {
  id: 1,
  name: "Ejemplo",
  observations: "Ejemplo",
  codChargeType: 1,
  codContractType: 1,
  baseSalary: 0,
  state: true,
};

export class ChargesRepositoryFake implements ChargesRepository {
  getTypesChargesList(): Promise<ITypesCharges[]> {
    throw new Error("Method not implemented.");
  }
  createCharge(_charge: ICharge): Promise<ICharge> {
    throw new Error("Method not implemented.");
  }
  updateCharge(_charge: ICharge, _id: number): Promise<ICharge | null> {
    throw new Error("Method not implemented.");
  }
  getChargesPaginate(_filters: IChargeFilters): Promise<IPagingData<ICharge>> {
    throw new Error("Method not implemented.");
  }
  updateChargeSalary(
    _id: number,
    _salary: number,
    _trx: TransactionClientContract
  ): Promise<ICharge | null> {
    const list = [{ ...chargeFake }];

    return new Promise((res) => {
      let charge = list.find((charge) => charge.id === _id);
      if (charge) charge = { ...charge, baseSalary: _salary };
      if (!charge) {
        return res(null);
      }

      return res(charge);
    });
  }
  getChargeById(id: number): Promise<ICharge | null> {
    const list = [{ ...chargeFake }];

    return new Promise((res) => {
      const charge = list.find((charge) => charge.id === id);

      if (!charge) {
        return res(null);
      }

      return res(charge);
    });
  }

  async getChargesList(): Promise<ICharge[]> {
    const list = [{ ...chargeFake }];

    return new Promise((res) => {
      return res(list);
    });
  }
}
