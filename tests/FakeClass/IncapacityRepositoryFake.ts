import {
  IIncapacity,
  IFilterIncapacity,
  IGetIncapacity,
} from "App/Interfaces/IncapacityInterfaces";
import IncapacityRepository from "App/Repositories/IncapacityRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const getIncapacityFake: IGetIncapacity = {
  userCreate: "test",
  id: 9,
  codIncapacityType: 2,
  codEmployment: 2,
  dateInitial: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
  dateFinish: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
  comments: "smoke test QA 14 08 2023",
  isExtension: false,
  userModified: "test",
  dateModified: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
  dateCreate: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
  typeIncapacity: {
    id: 2,
    name: "Enfermedad laboral",
  },
  employment: {
    id: 2,
    workerId: 4,
    idCharge: 1,
    institutionalMail: "test@test.com",
    contractNumber: "1233454",
    startDate: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
    state: "test",
    idTypeContract: 1,
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
};
export class IncapacityRepositoryFake implements IncapacityRepository {
  createIncapacity(_incapacity: IIncapacity): Promise<IIncapacity> {
    return Promise.resolve(_incapacity);
  }
  getIncapacityPaginate(
    _filters: IFilterIncapacity
  ): Promise<IPagingData<IGetIncapacity>> {
    throw new Error("Method not implemented.");
  }
  getIncapacityById(_id: number): Promise<IGetIncapacity | null> {
    throw new Error("Method not implemented.");
  }
  updateIncapacity(
    _incapacity: IIncapacity,
    _id: number
  ): Promise<IIncapacity | null> {
    throw new Error("Method not implemented.");
  }

  getIncapacityDateCodEmployment(
    _codEmployment: number,
    _dateStart: DateTime,
    _dateEnd: DateTime
  ): Promise<IGetIncapacity[]> {
    const list = [getIncapacityFake];

    return new Promise((res) => {
      const incapacity = list.find(
        (incapacity) =>
          incapacity.codEmployment === _codEmployment &&
          incapacity.dateInitial >= _dateStart &&
          incapacity.dateInitial <= _dateEnd &&
          incapacity.dateFinish >= _dateStart &&
          incapacity.dateFinish <= _dateEnd
      );

      if (!incapacity) {
        return res([]);
      }

      return res([incapacity]);
    });
  }
}
