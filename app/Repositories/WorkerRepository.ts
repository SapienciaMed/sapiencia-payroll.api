import { IWorker } from "App/Interfaces/WorkerInterfaces";
import Worker from "../Models/Worker";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import {
  IFilterVinculation,
  IGetVinculation,
} from "App/Interfaces/VinculationInterfaces";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IWorkerRepository {
  getVinculation(
    filters: IFilterVinculation
  ): Promise<IPagingData<IGetVinculation>>;
  getWorkerById(id: number): Promise<IWorker | null>;
  getActivesWorkers(temporary: string): Promise<IWorker[]>;
  getActivesContractorworkers(): Promise<IWorker[]>;
  createWorker(
    worker: IWorker,
    trx: TransactionClientContract
  ): Promise<IWorker>;
  editWorker(
    worker: IWorker,
    trx: TransactionClientContract
  ): Promise<IWorker | null>;
}

export default class WorkerRepository implements IWorkerRepository {
  constructor() {}

  // async getWorkersByFilters(filters: IWorkerFilters): Promise<IWorker[]> {
  //   const query = Worker.query().preload("employment", (q1) =>
  //     q1.where("state", 1).preload("charge", (q2) => q2.preload("unit"))
  //   );

  //   if (filters.documentList)
  //     query.whereIn("numberDocument", filters.documentList);
  //   const res = await query;
  //   return res.map((i) => i.serialize() as IWorker);
  // }

  async getVinculation(
    filters: IFilterVinculation
  ): Promise<IPagingData<IGetVinculation>> {
    const res = Worker.query();

    if (filters.firtsName) {
      res
        .whereRaw(
          `UPPER(REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                TRA_PRIMER_NOMBRE,
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
          [`%${filters.firtsName}%`]
        )
        .orWhereRaw(
          `UPPER(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  TRA_SEGUNDO_NOMBRE,
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
          [`%${filters.firtsName}%`]
        );
    }

    if (filters.secondName) {
      res
        .whereRaw(
          `REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                TRA_PRIMER_NOMBRE,
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
          [`%${filters.secondName}%`]
        )
        .orWhereRaw(
          `UPPER(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  TRA_SEGUNDO_NOMBRE,
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
          [`%${filters.secondName}%`]
        );
    }

    if (filters.surname) {
      res
        .whereRaw(
          `UPPER(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  TRA_PRIMER_APELLIDO,
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
          [`%${filters.surname}%`]
        )
        .orWhereRaw(
          `UPPER(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  TRA_SEGUNDO_APELLIDO,
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
          [`%${filters.surname}%`]
        );
    }

    if (filters.secondSurname) {
      res
        .whereRaw(
          `UPPER(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  TRA_PRIMER_APELLIDO,
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
          [`%${filters.secondSurname}%`]
        )
        .orWhereRaw(
          `UPPER(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  TRA_SEGUNDO_APELLIDO,
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
          [`%${filters.secondSurname}%`]
        );
    }

    if (filters.documentNumber) {
      res.whereILike("numberDocument", `%${filters.documentNumber}%`);
    }

    res.whereHas("employment", (employmentQuery) => {
      if (filters.state) {
        employmentQuery.where("state", filters.state);
      }

      if (filters.vinculationType) {
        employmentQuery.where("idTypeContract", filters.vinculationType);
      }
    });
    res.preload("employment", (query) => {
      if (filters.state) {
        query.where("state", filters.state);
      }

      if (filters.vinculationType) {
        query.where("idTypeContract", filters.vinculationType);
      }
      query.preload("typesContracts");
    });

    const workerEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = workerEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IGetVinculation[],
      meta,
    };
  }

  async getWorkerById(id: number): Promise<IWorker | null> {
    const res = await Worker.find(id);
    return res ? (res.serialize() as IWorker) : null;
  }

  async getActivesWorkers(temporary: string): Promise<IWorker[]> {
    const res = await Worker.query()
      .whereHas("employment", (employmentQuery) => {
        employmentQuery.where("state", true);

        employmentQuery.whereHas("typesContracts", (typesContractsQuery) => {
          if (temporary === "no") {
            typesContractsQuery.where("temporary", false);
          }
          //  else {
          //   typesContractsQuery.where("temporary", true);
          // }
        });
      })
      .preload("employment", (employmentQuery) => {
        employmentQuery.where("state", true);
        employmentQuery.preload("typesContracts", (typesContractsQuery) => {
          if (temporary === "no") {
            typesContractsQuery.where("temporary", false);
          } else {
            typesContractsQuery.where("temporary", true);
          }
        });
      });
    return res as IWorker[];
  }

  async getActivesContractorworkers(): Promise<IWorker[]> {
    const res = await Worker.query()
      .whereHas("employment", (employmentQuery) => {
        employmentQuery.where("state", "1");
        employmentQuery.preload("typesContracts", (typesContractQuery) => {
          typesContractQuery.where("temporary", true);
        });
      })
      .preload("employment");
    return res as IWorker[];
  }

  async createWorker(
    worker: IWorker,
    trx: TransactionClientContract
  ): Promise<IWorker> {
    const toCreate = new Worker().useTransaction(trx);

    toCreate.fill({ ...worker });
    await toCreate.save();
    return toCreate.serialize() as IWorker;
  }

  async editWorker(
    worker: IWorker,
    trx: TransactionClientContract
  ): Promise<IWorker | null> {
    const toUpdate = await Worker.find(worker.id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.merge({ ...toUpdate, ...worker }).useTransaction(trx);

    await toUpdate.save();

    return toUpdate.serialize() as IWorker;
  }
}
