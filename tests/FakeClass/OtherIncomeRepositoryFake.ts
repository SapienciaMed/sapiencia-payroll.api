import {
  IOtherIncome,
  IFilterOtherIncome,
  IGetOtherIncome,
} from "App/Interfaces/OtherIncomeInterfaces";

import { IOtherIncomeRepository } from "App/Repositories/OtherIncomeRepository";

import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const otherIncomeFake: IOtherIncome = {
  id: 1,
  codEmployment: 11,
  codPayroll: 1,
  codTypeIncome: 17,
  state: "Pendiente",
  value: 15000000.0,
};

const otherIncomeResult: IGetOtherIncome = {
  id: 1,
  codEmployment: 11,
  codPayroll: 1,
  codTypeIncome: 17,
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
  typeIncome: {
    id: 17,
    name: "Incapacidad",
    accountingAccount: "",
    type: "Eventual",
  },
};

export class OtherIncomeRepositoryFake implements IOtherIncomeRepository {
  async getOtherIncomeById(id: number): Promise<IOtherIncome | null> {
    const list = [otherIncomeFake];

    return list.find((i) => i.id === id) ?? null;
  }

  async createOtherIncome(_otherIncome: IOtherIncome): Promise<IOtherIncome> {
    return _otherIncome;
  }

  async updateOtherIncome(
    _otherIncome: IOtherIncome
  ): Promise<IOtherIncome | null> {
    const list = [_otherIncome];

    return list.find((i) => i.id === otherIncomeFake.id) ?? null;
  }

  async getOtherIncomePaginate(
    filters: IFilterOtherIncome
  ): Promise<IPagingData<IGetOtherIncome>> {
    const list = [{ ...otherIncomeResult }, { ...otherIncomeResult }];

    if (filters.codEmployment) {
      const otherIncome = list.find(
        (i) => i.codEmployment === filters.codEmployment
      );

      return {
        array: [otherIncome] as IGetOtherIncome[],
        meta: { total: 1 },
      };
    }

    if (filters.codPayroll) {
      const otherIncome = list.find(
        (i) => i.codEmployment === filters.codPayroll
      );

      return {
        array: [otherIncome] as IGetOtherIncome[],
        meta: { total: 1 },
      };
    }

    return {
      array: list,
      meta: { total: 1 },
    };
  }
}
