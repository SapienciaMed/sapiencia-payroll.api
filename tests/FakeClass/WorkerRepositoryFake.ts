import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import {
  IFilterVinculation,
  IGetVinculation,
} from "App/Interfaces/VinculationInterfaces";
import { IWorker } from "App/Interfaces/WorkerInterfaces";
import { IWorkerRepository } from "App/Repositories/WorkerRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const workerFake: IWorker = {
  id: 1,
  typeDocument: "CC",
  numberDocument: "123456789",
  firstName: "Juan",
  secondName: "",
  surname: "Andrade",
  secondSurname: "",
  gender: "M",
  bloodType: "1",
  birthDate: DateTime.now(),
  nationality: "COL",
  email: "",
  contactNumber: "3006847693",
  department: "5",
  municipality: "1",
  neighborhood: "17",
  address: "CLL 98 A57 #58",
  socioEconomic: "3",
  eps: "2",
  severanceFund: "",
  arl: "",
  riskLevel: "",
  housingType: "",
  fundPension: "",
  userCreate: "",
  userModified: "",
};

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

export class WorkerRepositoryFake implements IWorkerRepository {
  getActivesWorkers(): Promise<IWorker[]> {
    throw new Error("Method not implemented.");
  }
  getWorkerById(id: number): Promise<IWorker | null> {
    const list = [{ ...workerFake }];

    return new Promise((res) => {
      const worker = list.find((worker) => worker.id === id);

      if (!worker) {
        return res(null);
      }

      return res(worker);
    });
  }

  createWorker(_worker: IWorker): Promise<IWorker> {
    return new Promise((res) => {
      res(workerFake);
    });
  }

  getVinculation(
    _filters: IFilterVinculation
  ): Promise<IPagingData<IGetVinculation>> {
    return new Promise((res) => {
      res({
        array: [{ worker: workerFake, employment: employmentFake }],
        meta: { total: 100 },
      });
    });
  }

  editWorker(_worker: IWorker): Promise<IWorker | null> {
    return new Promise((res) => {
      res(workerFake);
    });
  }
}
