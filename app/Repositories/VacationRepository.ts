import { IVacation } from "App/Interfaces/VacationsInterfaces";
import Vacation  from "App/Models/Vacation";


export interface IVacationRepository {
  getVacations(): Promise<IVacation[]>;
}


export default class VacationRepository implements IVacationRepository {

  constructor() { }

  async getVacations(): Promise<IVacation[]> {
    const res = await Vacation.all();
    return res as IVacation[]
  } 

}