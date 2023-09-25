import {
  IFormPeriod,
  IFormPeriodFilters,
} from "App/Interfaces/FormPeriodInterface";
import { IFormTypes } from "App/Interfaces/FormTypesInterface";
import FormPeriodRepository from "App/Repositories/FormsPeriodRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const formPeriod: IFormPeriod = {
  idFormType: 2,
  state: "Generada",
  dateStart: DateTime.fromISO("2023-09-01T00:00:00.000-00:00"),
  dateEnd: DateTime.fromISO("2023-09-30T00:00:00.000-00:00"),
  paidDate: DateTime.fromISO("2023-10-05T00:00:00.000-00:00"),
  month: 9,
  year: 2023,
  observation: "test",
};

const formTypesFake: IFormTypes = {
  id: 9,
  special: false,
  name: "Cesantias",
  frecuencyPaid: "Mensual",
};
export class FormPeriodRepositoryFake implements FormPeriodRepository {
  getFormPeriod(): Promise<IFormPeriod[] | null> {
    throw new Error("Method not implemented.");
  }
  createFormPeriod(_formPeriod: IFormPeriod): Promise<IFormPeriod> {
    return Promise.resolve(formPeriod);
  }
  updateFormPeriod(
    _formPeriod: IFormPeriod,
    _id: number
  ): Promise<IFormPeriod | null> {
    const list = [formPeriod];

    return Promise.resolve(list.find((i) => i.id == _id) ?? null);
  }
  getFormTypes(): Promise<IFormTypes[]> {
    return Promise.resolve([formTypesFake]);
  }
  getLastPeriods(): Promise<IFormPeriod[]> {
    const list = [formPeriod];

    return Promise.resolve(
      list.filter((i) => i.state == "Pendiente" || i.state == "Generada")
    );
  }
  getFormPeriodById(_id: number): Promise<IFormPeriod | null> {
    const list = [{ ...formPeriod }];

    return new Promise((res) => {
      const formPeriods = list.find((formPeriod) => formPeriod.id === _id);

      if (!formPeriods) {
        return res(null);
      }

      return res(formPeriods);
    });
  }
  getFormsPeriodPaginate(
    _filters: IFormPeriodFilters
  ): Promise<IPagingData<IFormPeriod>> {
    return Promise.resolve({ array: [formPeriod], meta: { total: 100 } });
  }
}
