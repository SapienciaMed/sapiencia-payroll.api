import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { ICharge, IChargeFilters } from "App/Interfaces/ChargeInterfaces";
import { ITypesCharges } from "App/Interfaces/TypesChargesInterfaces";
import Charge from "App/Models/Charge";
import TypesCharge from "App/Models/TypesCharge";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IChargesRepository {
  getChargeById(id: number): Promise<ICharge | null>;
  getChargesList(): Promise<ICharge[]>;
  updateChargeSalary(
    id: number,
    salary: number,
    trx: TransactionClientContract
  ): Promise<ICharge | null>;
  createCharge(charge: ICharge): Promise<ICharge>;
  updateCharge(charge: ICharge, id: number): Promise<ICharge | null>;
  getChargesPaginate(filters: IChargeFilters): Promise<IPagingData<ICharge>>;
  getTypesChargesList(): Promise<ITypesCharges[]>;
}

export default class ChargesRepository implements IChargesRepository {
  constructor() {}
  async getChargeById(id: number): Promise<ICharge | null> {
    const res = await Charge.find(id);
    return res ? (res.serialize() as ICharge) : null;
  }

  async getChargesList(): Promise<ICharge[]> {
    const res = await Charge.all();
    return res as ICharge[];
  }

  async getTypesChargesList(): Promise<ITypesCharges[]> {
    const res = await TypesCharge.all();
    return res as ITypesCharges[];
  }
  async createCharge(charge: ICharge): Promise<ICharge> {
    const toCreate = new Charge();

    toCreate.fill({ ...charge, userCreate: undefined });
    await toCreate.save();
    return toCreate.serialize() as ICharge;
  }

  async updateCharge(charge: ICharge, id: number): Promise<ICharge | null> {
    const toUpdate = await Charge.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({ ...toUpdate, ...charge, userModify: undefined });

    await toUpdate.save();

    return toUpdate.serialize() as ICharge;
  }

  async updateChargeSalary(
    id: number,
    salary: number,
    trx: TransactionClientContract
  ): Promise<ICharge | null> {
    const toUpdate = await Charge.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.merge({ ...toUpdate, baseSalary: salary }).useTransaction(trx);

    await toUpdate.save();
    return toUpdate.serialize() as ICharge;
  }

  async getChargesPaginate(
    filters: IChargeFilters
  ): Promise<IPagingData<ICharge>> {
    const res = Charge.query();
    if (filters.codChargeType) {
      res.where("codChargeType", filters.codChargeType);
    }
    if (filters.name) {
      res.whereRaw(
        `UPPER(REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                CRG_NOMBRE,
                'Á', 'A'
              ),
              'É', 'E'
            ),
            'Í', 'I'
          ),
          'Ó', 'O'
        ),
        'Ú', 'U'
      )
    ) like
    UPPER(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                (?),
                'Á', 'A'
              ),
              'É', 'E'
            ),
            'Í', 'I'
          ),
          'Ó', 'O'
        ),
        'Ú', 'U'
      )
    )`,
        [`%${filters.name}%`]
      );
    }
    res.preload("typeCharge");
    const chargePaginated = await res.paginate(filters.page, filters.perPage);

    const { data, meta } = chargePaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as ICharge[],
      meta,
    };
  }
}
