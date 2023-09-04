import { IIncapacityTypes } from "App/Interfaces/TypesIncapacityInterface";
import IncapacityTypesRepository from "App/Repositories/IncapacityTypesRepository";

const incapacityTypesFake: IIncapacityTypes = {
  id: 1,
  name: "Enfermedad laboral",
};

export class IncapacityTypesRepositoryFake
  implements IncapacityTypesRepository
{
  getIncapacityTypesById(_id: number): Promise<IIncapacityTypes | null> {
    const list = [{ ...incapacityTypesFake }];

    return new Promise((res) => {
      const incapacityTypes = list.find(
        (incapacityType) => incapacityType.id === _id
      );

      if (!incapacityTypes) {
        return res(null);
      }

      return res(incapacityTypes);
    });
  }
  getIncapacityTypes(): Promise<IIncapacityTypes[]> {
    return new Promise((res) => {
      return res([incapacityTypesFake]);
    });
  }
}
