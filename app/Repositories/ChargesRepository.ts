import { ICharge } from "App/Interfaces/ChargeInterfaces";
import Charge from "App/Models/Charge";

export interface IChargesRepository {
  getChargeById(id: number): Promise<ICharge | null>;
  getChargesList(): Promise<ICharge[]>;
}

export default class ChargesRepository implements IChargesRepository {
  constructor() {}
  async getChargeById(id: number): Promise<ICharge | null> {
    const res = await Charge.find(id);
    return res ? (res.serialize() as ICharge) : null;
  }

  async getChargesList(): Promise<ICharge[]> {
    const res = await Charge.all();
    return res as ICharge[]
  }
}
