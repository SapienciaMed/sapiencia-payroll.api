import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import {
  IManualDeduction,
  IManualDeductionFilters,
} from "App/Interfaces/ManualDeductionsInterfaces";

import ManualDeductionRepository from "App/Repositories/ManualDeductionRepository";
import { IPagingData } from "App/Utils/ApiResponses";

const deduction: IManualDeduction = {
  codEmployment: 17,
  codDeductionType: 1,
  cyclic: true,
  numberInstallments: 5,
  applyExtraordinary: false,
  value: 5000,
  state: "Vigente",
  observation: "test",
};

const deductionTypesFake: IDeductionType = {
  id: 1,
  name: "Aportes AFC",
  type: "Ciclica",
};
export class ManualDeductionRepositoryFake
  implements ManualDeductionRepository
{
  createManualDeduction(
    _manualDeduction: IManualDeduction
  ): Promise<IManualDeduction> {
    return Promise.resolve(deduction);
  }
  updateManualDeduction(
    _manualDeduction: IManualDeduction,
    _id: number
  ): Promise<IManualDeduction | null> {
    const list = [deduction];

    return Promise.resolve(list.find((i) => i.id == _id) ?? null);
  }
  getDeductionTypes(): Promise<IDeductionType[]> {
    return Promise.resolve([deductionTypesFake]);
  }
  getDeductionTypesByType(_type: string): Promise<IDeductionType[]> {
    return Promise.resolve(
      [deductionTypesFake].filter((deduction) => {
        deduction.type == "Ciclicas";
      })
    );
  }
  getManualDeductionPaginate(
    _filters: IManualDeductionFilters
  ): Promise<IPagingData<IManualDeduction>> {
    return Promise.resolve({ array: [deduction], meta: { total: 100 } });
  }
  getManualDeductionById(_id: number): Promise<IManualDeduction[] | null> {
    const list = [{ ...deduction }];

    return new Promise((res) => {
      const deductions = list.find((deduction) => deduction.id === _id);

      if (!deductions) {
        return res(null);
      }

      return res([deductions]);
    });
  }
}
