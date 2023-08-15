import { ILicence, ILicenceFilters } from "App/Interfaces/LicenceInterfaces";
import { ILicenceType } from "App/Interfaces/LicenceTypesInterface";
import Licence from "App/Models/Licence";
import LicenceType from "App/Models/LicenceType";
import { IPagingData } from "App/Utils/ApiResponses";

export interface ILicenceRepository {
  createLicence(licence: ILicence): Promise<ILicence>;
  getLicenceDateCodEmployment(licence: ILicence): Promise<ILicence[]>;
  getLicenceTypes(): Promise<ILicenceType[]>;
  getLicencePaginate(filters: ILicenceFilters): Promise<IPagingData<ILicence>>;
}

export default class LicenceRepository implements ILicenceRepository {
  constructor() {}

  async createLicence(licence: ILicence): Promise<ILicence> {
    const toCreate = new Licence();

    toCreate.fill({ ...licence });
    await toCreate.save();
    return toCreate.serialize() as ILicence;
  }

  async getLicenceDateCodEmployment(licence: ILicence): Promise<ILicence[]> {
    const incapacityFind = await Licence.query()
      .where("codEmployment", licence.codEmployment)
      .where("dateStart", licence.dateStart.toString())
      .where("dateEnd", licence.dateEnd.toString());

    return incapacityFind as ILicence[];
  }

  async getLicenceTypes(): Promise<ILicenceType[]> {
    const licenceTypes = await LicenceType.all();
    return licenceTypes as ILicenceType[];
  }

  async getLicencePaginate(
    filters: ILicenceFilters
  ): Promise<IPagingData<ILicence>> {
    const res = Licence.query();
    
    if (filters.codEmployment) {
      res.whereHas("employment", (employmentQuery) => {
        if (filters.codEmployment) {
          employmentQuery.where("id", filters.codEmployment);
        }
      });
    }
    if (filters.idLicenceType) {
      res.where("idLicenceType", filters.idLicenceType);
    }

    if (filters.state) {
      res.where("licenceState", filters.state);
    }
    res.preload("employment", (employmentQuery) => {
      employmentQuery.preload("charges");
      if (filters.codEmployment) {
        employmentQuery.where("id", filters.codEmployment);
      }
      employmentQuery.preload("worker");
    });
    res.preload("licenceType")

    const workerEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = workerEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as ILicence[],
      meta,
    };
  }
}
