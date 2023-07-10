import { ITypesCharges } from "App/Interfaces/TypesChargesInterfaces";
import TypesCharge from "App/Models/TypesCharge";

export interface ITypesChargesRepository {
  getTypeChargeById(id: number): Promise<ITypesCharges | null>;
  getTypesChargesList(): Promise<ITypesCharges[]>;
}

export default class TypesChargesRepository implements ITypesChargesRepository {
  constructor() {}
  async getTypeChargeById(id: number): Promise<ITypesCharges | null> {
    const res = await TypesCharge.find(id);
    return res ? (res.serialize() as ITypesCharges) : null;
  }

  async getTypesChargesList(): Promise<ITypesCharges[]> {
    const res = await TypesCharge.all();
    return res as ITypesCharges[]
  }
}
