import { ILicence, ILicenceFilters } from "App/Interfaces/LicenceInterfaces";
import { ILicenceType } from "App/Interfaces/LicenceTypesInterface";
import LicenceRepository from "App/Repositories/LicenceRepository";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

const licenceFake: ILicence = {
  id: 1,
  codEmployment: 1,
  dateStart: DateTime.fromFormat("01/07/2023", "dd/MM/yyyy"),
  dateEnd: DateTime.fromFormat("01/07/2023", "dd/MM/yyyy"),
  idLicenceType: 1,
  licenceState: "En progreso",
  resolutionNumber: "12345 de julio",
  observation: "test",
};
const licenceTypesFake: ILicenceType = {
  id: 1,
  name: "permiso remunerado",
  numberDays: 5,
  daysType: "Habil",
  paid: false
};
export class LicenceRepositoryFake implements LicenceRepository {
  createLicence(_licence: ILicence): Promise<ILicence> {
    return Promise.resolve(licenceFake);
  }
  getLicenceDateCodEmployment(
    _codEmployment: number,
    _dateStart: DateTime,
    _dateEnd: DateTime
  ): Promise<ILicence[]> {
    const list = [licenceFake];

    return new Promise((res) => {
      const licences = list.find(
        (licence) =>
          licence.codEmployment === _codEmployment &&
          licence.dateStart >= _dateStart &&
          licence.dateStart <= _dateEnd &&
          licence.dateEnd >= _dateStart &&
          licence.dateEnd <= _dateEnd
      );

      if (!licences) {
        return res([]);
      }

      return res([licences]);
    });
  }
  getLicenceTypes(): Promise<ILicenceType[]> {
    return Promise.resolve([licenceTypesFake]);
  }
  getLicencePaginate(
    _filters: ILicenceFilters
  ): Promise<IPagingData<ILicence>> {
    return Promise.resolve({ array: [licenceFake], meta: { total: 100 } });
  }
  getLicenceById(_id: number): Promise<ILicence[] | null> {
    const list = [{ ...licenceFake }];

    return new Promise((res) => {
      const licences = list.find((licence) => licence.id === _id);

      if (!licences) {
        return res(null);
      }

      return res([licences]);
    });
  }
}
