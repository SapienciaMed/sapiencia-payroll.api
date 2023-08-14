import { ILicence } from "App/Interfaces/LicenceInterfaces";
import { ILicenceType } from "App/Interfaces/LicenceTypesInterface";
import Licence from "App/Models/Licence";
import LicenceType from "App/Models/LicenceType";

export interface ILicenceRepository {
  createLicence(licence: ILicence): Promise<ILicence>;
  getLicenceDateCodEmployment(licence: ILicence): Promise<ILicence[]>;
  getLicenceTypes():Promise<ILicenceType[]>;
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

  async getLicenceTypes():Promise<ILicenceType[]>{
    const licenceTypes = await LicenceType.all()
    return licenceTypes as ILicenceType[];
  }
}
