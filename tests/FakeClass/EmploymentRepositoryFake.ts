import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import EmploymentRepository from "App/Repositories/EmploymentRepository";
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

export class EmploymentRepositoryFake implements EmploymentRepository {
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
}
