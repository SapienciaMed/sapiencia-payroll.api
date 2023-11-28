import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { ICharge } from "App/Interfaces/ChargeInterfaces";
import {
  IEmployment,
  IEmploymentWorker,
  IFilterEmployment,
  IReasonsForWithdrawal,
  IRetirementEmployment,
} from "App/Interfaces/EmploymentInterfaces";
import { IHistoricalPayroll } from "App/Interfaces/HistoricalPayrollInterfaces";
import Charge from "App/Models/Charge";
import Employment from "App/Models/Employment";
import HistoricalPayroll from "App/Models/HistoricalPayroll";
import ReasonsForWithdrawal from "App/Models/ReasonsForWithdrawal";
import { IPagingData } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";

export interface IEmploymentRepository {
  createEmployment(
    employment: IEmployment,
    trx: TransactionClientContract
  ): Promise<IEmployment>;
  getEmploymentWorkerById(id: number): Promise<IEmployment[] | null>;
  getEmploymentWorker(
    filters: IFilterEmployment
  ): Promise<IPagingData<IEmployment>>;
  getEmploymentById(id: number): Promise<IEmploymentWorker[] | null>;
  getEmploymentsbyCharge(idCharge: number): Promise<IEmployment[]>;
  getChargeEmployment(idEmployment: number): Promise<ICharge>;
  getReasonsForWithdrawalList(): Promise<IReasonsForWithdrawal[]>;
  retirementEmployment(
    data: IRetirementEmployment
  ): Promise<IEmployment | null>;
  updateContractDate(
    idEmployment: number,
    date: DateTime,
    trx: TransactionClientContract
  ): Promise<IEmployment | null>;
  getEmploymentByPayroll(idPayroll: number): Promise<IHistoricalPayroll[]>;
}

export default class EmploymentRepository implements IEmploymentRepository {
  constructor() {}
  async getChargeEmployment(idEmployment: number): Promise<ICharge> {
    const employment = await Employment.findOrFail(idEmployment);
    const res = await Charge.query().where("id", employment.idCharge).first();
    return res as ICharge;
  }

  async getEmploymentWorker(
    filters: IFilterEmployment
  ): Promise<IPagingData<IEmployment>> {
    const res = Employment.query();

    res.preload("typesContracts");
    res.preload("charges");
    res.where("workerId", filters.workerId);
    const workerEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = workerEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IEmployment[],
      meta,
    };
  }
  async getEmploymentWorkerById(id: number): Promise<IEmployment[] | null> {
    const res = await Employment.query().where("workerId", id);
    return res as IEmployment[];
  }

  async getEmploymentsbyCharge(idCharge: number): Promise<IEmployment[]> {
    const res = await Employment.query()
      .where("state", 1)
      .andWhere("idCharge", idCharge);
    return res as IEmployment[];
  }
  async getEmploymentById(id: number): Promise<IEmploymentWorker[] | null> {
    const res = Employment.query().where("id", id);

    res.preload("worker");
    res.preload("typesContracts");

    const data = await res;

    if (!data) {
      return null;
    }

    return data as IEmploymentWorker[];
  }

  async createEmployment(
    employment: IEmployment,
    trx: TransactionClientContract
  ): Promise<IEmployment> {
    const toCreate = new Employment().useTransaction(trx);

    toCreate.fill({ ...employment, userCreate: undefined });
    await toCreate.save();
    return toCreate.serialize() as IEmployment;
  }

  async retirementEmployment(
    data: IRetirementEmployment
  ): Promise<IEmployment | null> {
    const { idEmployment, ...dataRetirement } = data;

    const toUpdate = await Employment.find(idEmployment);

    if (!toUpdate) return null;

    await toUpdate
      .merge({ ...toUpdate, ...dataRetirement, userModified: undefined })
      .save();

    return toUpdate.serialize() as IEmployment;
  }

  async updateContractDate(
    idEmployment: number,
    date: DateTime,
    trx: TransactionClientContract
  ): Promise<IEmployment | null> {
    // Realiza la actualización
    const employment = await Employment.query()
      .where("id", idEmployment)
      .update({ endDate: new Date(date?.toJSDate()), dateModified: new Date() })
      .useTransaction(trx);

    if (employment) {
      // Busca el registro actualizado
      const updatedEmployment = await Employment.find(idEmployment);

      if (updatedEmployment) {
        return updatedEmployment.serialize() as IEmployment;
      }
    }

    return null;
  }
  async getReasonsForWithdrawalList(): Promise<IReasonsForWithdrawal[]> {
    const res = await ReasonsForWithdrawal.all();
    return res as IReasonsForWithdrawal[];
  }

  async getEmploymentByPayroll(
    idPayroll: number
  ): Promise<IHistoricalPayroll[]> {
    const historico = await HistoricalPayroll.query()
      .preload("employment", (employmentQuery) => {
        employmentQuery.preload("worker");
      })
      .where("idTypePayroll", idPayroll)
      .whereNot("state", "Fallido");

    return historico.map((i) => i.serialize()) as IHistoricalPayroll[];
  }
}
