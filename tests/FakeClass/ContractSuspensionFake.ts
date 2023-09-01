import {
  IcontractSuspension,
  IFilterContractSuspension,
} from "App/Interfaces/ContractSuspensionInterfaces";
import ContractSuspensionRepository from "App/Repositories/ContractSuspensionRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const contractSuspension: IcontractSuspension = {
  codEmployment: 17,
  dateStart: DateTime.fromISO("2023-08-31T00:00:00.000-05:00"),
  dateEnd: DateTime.fromISO("2023-09-15T00:00:00.000-05:00"),
  adjustEndDate: false,
  newDateEnd: DateTime.fromISO("2023-09-16T00:00:00.000-05:00"),
  observation: "test",
  dateModified: DateTime.fromISO("2023-09-01T12:08:37.904-05:00"),
  dateCreate: DateTime.fromISO("2023-09-01T12:08:37.904-05:00"),
  id: 6,
};
export class ContractSuspensionRepositoryFake
  implements ContractSuspensionRepository
{
  createContractSuspension(
    _contractSuspension: IcontractSuspension
  ): Promise<IcontractSuspension> {
    return Promise.resolve(contractSuspension);
  }
  getContractSuspensionPaginate(
    _filters: IFilterContractSuspension
  ): Promise<IPagingData<IcontractSuspension>> {
    return Promise.resolve({
      array: [contractSuspension],
      meta: { total: 100 },
    });
  }
  getContractSuspensionBetweenDate(
    _codEmployment: number,
    _dateStart: DateTime,
    _dateEnd: DateTime
  ): Promise<IcontractSuspension[]> {
    const list = [contractSuspension];

    return new Promise((res) => {
      const suspension = list.find(
        (suspension) =>
          suspension.codEmployment === _codEmployment &&
          suspension.dateStart >= _dateStart &&
          suspension.dateStart <= _dateEnd &&
          suspension.dateEnd >= _dateStart &&
          suspension.dateEnd <= _dateEnd
      );

      if (!suspension) {
        return res([]);
      }

      return res([suspension]);
    });
  }
}
