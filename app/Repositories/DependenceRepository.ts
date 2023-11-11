import { IDependence } from "App/Interfaces/DependenceInterfaces";
import Dependence from "App/Models/Dependence";

export interface IDependenceRepository {
  getAllDependencies(): Promise<IDependence[]>;
}

export default class DependenceRepository implements IDependenceRepository {
  constructor() {}

  async getAllDependencies(): Promise<IDependence[]> {
    const res = await Dependence.query();
    return res.map((i) => i.serialize() as IDependence);
  }
}
