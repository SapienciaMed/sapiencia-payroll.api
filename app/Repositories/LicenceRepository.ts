import { ILicence, ILicenceFilters } from "App/Interfaces/LicenceInterfaces";
import { ILicenceType } from "App/Interfaces/LicenceTypesInterface";
import Licence from "App/Models/Licence";
import LicenceType from "App/Models/LicenceType";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

export interface ILicenceRepository {
  createLicence(licence: ILicence): Promise<ILicence>;
  getLicenceDateCodEmployment(codEmployment:number,dateStart:DateTime,dateEnd:DateTime): Promise<ILicence[]>;
  getLicenceTypes(): Promise<ILicenceType[]>;
  getLicencePaginate(filters: ILicenceFilters): Promise<IPagingData<ILicence>>;
  getLicenceById(id: number): Promise<ILicence[] | null>;
}

export default class LicenceRepository implements ILicenceRepository {
  constructor() {}

  async createLicence(licence: ILicence): Promise<ILicence> {
    const toCreate = new Licence();

    toCreate.fill({ ...licence });
    await toCreate.save();
    return toCreate.serialize() as ILicence;
  }

  async getLicenceDateCodEmployment(codEmployment:number,dateStart:DateTime,dateEnd:DateTime): Promise<ILicence[]> {
    const licenceFind = await Licence.query()
      .where("codEmployment", codEmployment)
      .andWhereBetween("dateStart", [dateStart.toString(),dateEnd.toString()])
      .andWhereBetween("dateEnd", [dateStart.toString(),dateEnd.toString()]);

    return licenceFind as ILicence[];
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

    if (filters.licenceState) {
      res.where("licenceState", filters.licenceState);
    }
    res.preload("employment", (employmentQuery) => {
      employmentQuery.preload("charges");
      if (filters.codEmployment) {
        employmentQuery.where("id", filters.codEmployment);
      }
      employmentQuery.preload("worker");
    });
    res.preload("licenceType");

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

  async getLicenceById(id: number): Promise<ILicence[] | null> {
    const queryLicence = Licence.query().where("id", id);

    queryLicence.preload("licenceType");

    queryLicence.preload("employment", (employmentQuery) => {
      employmentQuery.preload("worker");
    });

    const licence = await queryLicence;

    if (!licence) {
      return null;
    }

    return licence as ILicence[];
  }
}
