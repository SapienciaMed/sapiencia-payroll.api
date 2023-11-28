import { IRelative } from "App/Interfaces/RelativeInterfaces";
import { IRelativeRepository } from "App/Repositories/RelativeRepository";
import { DateTime } from "luxon";

const relativeFake: IRelative = {
  id: 1,
  workerId: 2,
  name: "Alfonso Andres",
  birthDate: DateTime.now(),
  gender: "F",
  relationship: "2",
  dependent: true,
  typeDocument: "CC",
  numberDocument: "4989854",
};

export class RelativeRepositoryFake implements IRelativeRepository {
  getRelativeWorkerById(workerId: number): Promise<IRelative[] | null> {
    const list = [{ ...relativeFake }, { ...relativeFake }] as IRelative[];

    return new Promise((res) => {
      const relative = list.find((relative) => relative.workerId === workerId);

      if (!relative) {
        return res(null);
      }

      return res([relative] as IRelative[]);
    });
  }

  createManyRelatives(relatives: IRelative[]): Promise<boolean> {
    const data: IRelative[] = [];

    return new Promise((res) => {
      relatives.forEach(() => {
        data.push(relativeFake);
      });

      return res(true);
    });
  }

  createRelative(relative: IRelative): Promise<IRelative> {
    const data: IRelative[] = [{ ...relative }];

    return new Promise((res) => {
      data.push(relativeFake);
      return res(relativeFake);
    });
  }

  deleteManyRelativeByWorker(id: number): Promise<boolean> {
    const list = [{ ...relativeFake }] as IRelative[];

    return new Promise((res) => {
      list.splice(id, 1);

      return res(true);
    });
  }
}
