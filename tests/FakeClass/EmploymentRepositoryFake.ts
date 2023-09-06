import {
  IEmployment,
  IEmploymentWorker,
  IReasonsForWithdrawal,
  IRetirementEmployment,
} from "App/Interfaces/EmploymentInterfaces";
import { IFilterVinculation } from "App/Interfaces/VinculationInterfaces";
import EmploymentRepository from "App/Repositories/EmploymentRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const employmentFake: IEmployment = {
  id: 2,
  workerId: 2,
  idCharge: 2,
  institutionalMail: "jhondoe@gmail.com",
  contractNumber: "378578483",
  startDate: DateTime.now(),
  state: "1",
  idTypeContract: 3,
  observation: "",
  salary: 234345,
  totalValue: 400000,
};

const reasonsForWithdrawalFake: IReasonsForWithdrawal = {
  id: 1,
  name: "Prueba",
};

export class EmploymentRepositoryFake implements EmploymentRepository {
  
  updateContractDate(
    _idEmployment: number,
    _date: DateTime
  ): Promise<IEmployment | null> {
    const list = [employmentFake];

    return new Promise((res) => {
      let employments = list.find(
        (employment) => employment.id === _idEmployment
      );
      if (employments) employments = { ...employments, endDate: _date };
      if (!employments) {
        return res(null);
      }

      return res(employments);
    });
  }
  getEmploymentsbyCharge(_idCharge: number): Promise<IEmployment[]> {
    const list = [
      { ...employmentFake },
      { ...employmentFake },
    ] as IEmployment[];

    return new Promise((res) => {
      const employment = list.find(
        (employment) => employment.idCharge === _idCharge
      );

      if (!employment) {
        return res([]);
      }

      return res([employment] as IEmploymentWorker[]);
    });
  }
  getEmploymentById(id: number): Promise<IEmploymentWorker[] | null> {
    const list = [
      { ...employmentFake },
      { ...employmentFake },
    ] as IEmployment[];

    return new Promise((res) => {
      const employment = list.find((employment) => employment.id === id);

      if (!employment) {
        return res(null);
      }

      return res([employment] as IEmploymentWorker[]);
    });
  }
  getEmploymentWorkerById(workerId: number): Promise<IEmployment[] | null> {
    const list = [
      { ...employmentFake },
      { ...employmentFake },
    ] as IEmployment[];

    return new Promise((res) => {
      const employment = list.find(
        (employment) => employment.workerId === workerId
      );

      if (!employment) {
        return res(null);
      }

      return res([employment] as IEmployment[]);
    });
  }

  createEmployment(_worker: IEmployment): Promise<IEmployment> {
    return new Promise((res) => {
      res(employmentFake);
    });
  }

  getEmploymentWorker(
    _filters: IFilterVinculation
  ): Promise<IPagingData<IEmployment>> {
    return new Promise((res) => {
      res({
        array: [{ ...employmentFake }],
        meta: { total: 100 },
      });
    });
  }

  async getReasonsForWithdrawalList(): Promise<IReasonsForWithdrawal[]> {
    return new Promise((res) => {
      res([reasonsForWithdrawalFake]);
    });
  }

  async retirementEmployment(
    data: IRetirementEmployment
  ): Promise<IEmployment | null> {
    const { idEmployment, ...dataRetirement } = data;

    const list = [employmentFake];

    return new Promise(() => {
      const employment = list.find(
        (employment) => employment.id === idEmployment
      );

      if (!employment) {
        return null;
      }

      const toUpdate = { ...employment, ...dataRetirement };

      return toUpdate;
    });
  }
}
