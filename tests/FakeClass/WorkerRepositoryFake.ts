// import { IWorker } from "App/Interfaces/WorkerInterfaces";
// import { IWorkerRepository } from "App/Repositories/WorkerRepository";

// const workerFake: IWorker = {
//   id: 1,
//   typeDocument:
// };

// typeDocument: string;
// numberDocument: string;
// firstName: string;
// secondName?: string;
// surName: string;
// secondSurname?: string;
// gender: string;
// bloodType: string;
// birthDate: DateTime;
// nationality: string;
// email?: string;
// contactNumber: string;
// department: string;
// municipality: string;
// neighborhood: string;
// address: string;
// socioEconomic?: string;
// eps?: string;
// severanceFund?: string;
// arl?: string;
// riskLevel?: string;
// housingType?: string;
// fundPension?: string;
// userModified?: string;
// dateModified?: DateTime;
// userCreate?: string;
// dateCreate?: DateTime;

// export class WorkerRepositoryFake implements IWorkerRepository {
//   getWorkerById(id: number): Promise<IWorker | null> {
//     const list = [{ ...workerFake }];

//     return new Promise((res) => {
//       const worker = list.find((worker) => worker.id === id);

//       if (!worker) {
//         return res(null);
//       }

//       return res(worker);
//     });
//   }

//   createWorker(worker: IWorker): Promise<IWorker> {
//     return new Promise((res) => {
//       res(worker);
//     });
//   }
// }
