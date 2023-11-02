import {
  IFilterTaxDeductible,
  IGetTaxDeductible,
  ITaxDeductible,
} from "App/Interfaces/TaxDeductibleInterfaces";

import { ITaxDeductibleRepository } from "App/Repositories/TaxDeductibleRepository";

import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const taxDeductibleFake: ITaxDeductible = {
  id: 1,
  codEmployment: 11,
  type: "D01",
  year: 2023,
  state: "Pendiente",
  value: 15000000.0,
};

const otherIncomeResult: IGetTaxDeductible = {
  id: 1,
  codEmployment: 11,
  type: "D01",
  year: 2023,
  state: "Pendiente",
  value: 15000000.0,
  employment: {
    id: 2,
    workerId: 2,
    idCharge: 2,
    institutionalMail: "jhondoe@gmail.com",
    contractNumber: "378578483",
    startDate: DateTime.now(),
    state: "1",
    idTypeContract: 3,
    observation: "",
    //salary: 234345,
    totalValue: 400000,
    worker: {
      id: 4,
      typeDocument: "CC",
      numberDocument: "1030523782",
      firstName: "Jeisson",
      secondName: "Andrés",
      surname: "González",
      secondSurname: "Martínez",
      gender: "",
      bloodType: "",
      birthDate: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
      nationality: "",
      contactNumber: "",
      department: "",
      municipality: "",
      neighborhood: "",
      address: "",
    },
  },
};

export class TaxDeductibleRepositoryFake implements ITaxDeductibleRepository {
  async getTaxDeductibleById(id: number): Promise<ITaxDeductible | null> {
    const list = [taxDeductibleFake];

    return list.find((i) => i.id === id) ?? null;
  }

  async createTaxDeductible(
    _taxDeductible: ITaxDeductible
  ): Promise<ITaxDeductible> {
    return _taxDeductible;
  }

  async updateTaxDeductible(
    _taxDeductible: ITaxDeductible
  ): Promise<ITaxDeductible | null> {
    const list = [_taxDeductible];

    return list.find((i) => i.id === taxDeductibleFake.id) ?? null;
  }

  async getTaxDeductiblePaginate(
    filters: IFilterTaxDeductible
  ): Promise<IPagingData<IGetTaxDeductible>> {
    const list = [{ ...otherIncomeResult }, { ...otherIncomeResult }];

    if (filters.codEmployment) {
      const taxDeductible = list.find(
        (i) => i.codEmployment === filters.codEmployment
      );

      return {
        array: [taxDeductible] as IGetTaxDeductible[],
        meta: { total: 1 },
      };
    }

    if (filters.year) {
      const taxDeductible = list.find((i) => i.year === filters.year);

      return {
        array: [taxDeductible] as IGetTaxDeductible[],
        meta: { total: 1 },
      };
    }

    return {
      array: list,
      meta: { total: 1 },
    };
  }
}
