import { IIncapacity,
         IFilterIncapacity,
         IGetIncapacity,
         IGetIncapacityList } from "App/Interfaces/IncapacityInterfaces";
import Incapacity from "App/Models/Incapacity";
import { IPagingData } from "App/Utils/ApiResponses";
// import Database from '@ioc:Adonis/Lucid/Database'

export interface IIncapacityRepository {

  createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>;
  getIncapacity( filters: IFilterIncapacity ): Promise<IPagingData<IGetIncapacity>>;
  getIncapacityPaginateRelational( filters: IFilterIncapacity ): Promise<IPagingData<IGetIncapacityList>>;
  getIncapacityById(id: number): Promise<IIncapacity | null>;
  getIncapacityByIdRelational(idr: number): Promise<IGetIncapacityList | null>;

}

export default class IncapacityRepository implements IIncapacityRepository {

  constructor() { }

  //?CREAR INCAPACIDAD
  async createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>{

    const toCreate = new Incapacity();
    toCreate.fill({ ...incapacity });

    await toCreate.save();
    return toCreate.serialize() as IIncapacity;

  }

  //?BUSCAR INCAPACIDAD PAGINADO
  async getIncapacity( filters: IFilterIncapacity ): Promise<IPagingData<IGetIncapacity>> {

    const res = Incapacity.query();

    if (filters.idEmployee) {
      res.where("codEmployee", filters.idEmployee);
    }

    const incapacityEmploymentPaginated = await res.paginate( filters.page, filters.perPage );



    const { data, meta } = incapacityEmploymentPaginated.serialize();
    const dataArray = data ?? [];


    return {
      // array: dataArray as IGetIncapacity[],
      array: dataArray as any[],
      meta,
    };
  }

  //?BUSCAR INCAPACIDAD POR ID
  async getIncapacityById(id: number): Promise<IIncapacity | null> {

    const res = await Incapacity.find(id);
    return res ? (res.serialize() as Incapacity) : null;

  }

  //?BUSCAR INCAPACIDAD PAGINADO -LISTADO RELACIONAL
  async getIncapacityPaginateRelational( filters: IFilterIncapacity ): Promise<IPagingData<IGetIncapacityList>>{

    const res = Incapacity.query();

    res.select("id", "codIncapacityType", "codEmployee", "dateInitial", "dateFinish", "comments")
    res.preload("typeIncapacity", (q) => {
      q.select("name")
    });
    // res.preload("incapcityEmployee" , (r) => {
    //   r.select("id", "workerId" , "institutionalMail")
    // });
    res.preload("incapcityEmployee" , (s) => {
      s.select("id", "workerId", "institutionalMail")
      s.preload('workerEmployment' , (t) => {
        t.select("id", "typeDocument", "numberDocument", "firstName", "secondName", "surname", "secondSurname")
      })

    });

    if (filters.idEmployee) {
      res.where("codEmployee", filters.idEmployee);
    }

    const incapacityEmploymentPaginated = await res.paginate( filters.page, filters.perPage );

    const { data, meta } = incapacityEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IGetIncapacityList[],
      meta,
    };

  }

  //?BUSCAR INCAPACIDAD POR ID - Relacional
  async getIncapacityByIdRelational(idr: number): Promise<IGetIncapacityList | null> {

    const res = await Incapacity.find(idr);

    await res!.load('typeIncapacity', (q) => {
         q.select("name")
    })
    await res!.load("incapcityEmployee" , (s) => {
      s.select("id", "workerId", "institutionalMail")
      s.preload('workerEmployment' , (t) => {
        t.select("id", "typeDocument", "numberDocument", "firstName", "secondName", "surname", "secondSurname")
      })
    })

    return res ? (res.serialize() as IGetIncapacityList) : null;

  }


}
