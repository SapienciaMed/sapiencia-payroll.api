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

  editOrInsertMany(relatives: IRelative[]): Promise<boolean> {
    const data: IRelative[] = [];

    const list = [{ ...relativeFake }] as IRelative[];

    return new Promise((res) => {
      relatives.forEach((relativeMap) => {
        const relativeFind = list.find(
          (relative) => relative.id === relativeMap.id
        );

        if (relativeFind) {
          relativeFind.name = "Carlos manana";

          data.push(relativeFind);
        } else {
          data.push(relativeFake);
        }
      });

      return res(true);
    });
  }
}
