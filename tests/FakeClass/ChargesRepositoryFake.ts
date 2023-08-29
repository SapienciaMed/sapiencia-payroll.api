import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { ICharge } from "App/Interfaces/ChargeInterfaces";
import ChargesRepository from "App/Repositories/ChargesRepository";

const chargeFake: ICharge = {
  id: 1,
  name: "Ejemplo",
  codUnit: 1,
  codChargeType: 1,
  baseSalary: 0,
  state: "Activo",
};

export class ChargesRepositoryFake implements ChargesRepository {
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
