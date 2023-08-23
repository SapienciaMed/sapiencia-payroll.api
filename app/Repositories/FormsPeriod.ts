import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import FormsPeriod from "App/Models/FormsPeriod";


export interface IFormPeriodRepository {
  createFormPeriod(formPeriod: IFormPeriod): Promise<IFormPeriod>;
}

export default class FormPeriodRepository implements IFormPeriodRepository {
  constructor() {}
  async  createFormPeriod(formPeriod: IFormPeriod): Promise<IFormPeriod> {
    const toCreate = new FormsPeriod();

    toCreate.fill({ ...formPeriod });
    await toCreate.save();
    return toCreate.serialize() as IFormPeriod;
    }

}
