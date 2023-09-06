import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import { IFormTypes } from "App/Interfaces/FormTypesInterface";
import FormsPeriod from "App/Models/FormsPeriod";
import FormsType from "App/Models/FormsType";

export interface IFormPeriodRepository {
  createFormPeriod(formPeriod: IFormPeriod): Promise<IFormPeriod>;
  getFormTypes(): Promise<IFormTypes[]>;
  getLastPeriods(): Promise<IFormPeriod[]>
}

export default class FormPeriodRepository implements IFormPeriodRepository {
  constructor() {}
  async createFormPeriod(formPeriod: IFormPeriod): Promise<IFormPeriod> {
    const toCreate = new FormsPeriod();

    toCreate.fill({ ...formPeriod });
    await toCreate.save();
    return toCreate.serialize() as IFormPeriod;
  }

  async getFormTypes(): Promise<IFormTypes[]> {
    const res = await FormsType.all();
    return res as IFormTypes[];
  }

  async getLastPeriods(): Promise<IFormPeriod[]>{
    const res = await FormsPeriod.all();
    return res as IFormPeriod[];
  }
}
