import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import { IGrouper } from "App/Interfaces/GrouperInterfaces";
import { ILicence } from "App/Interfaces/LicenceInterfaces";
import Employment from "App/Models/Employment";
import Grouper from "App/Models/Grouper";
import Licence from "App/Models/Licence";
import { DateTime } from "luxon";
import Income from "App/Models/Income";

export interface IPayrollGenerateRepository {
  getActiveEmploments(dateStart: Date): Promise<IEmployment[]>;
  getByIdGrouper(id: number): Promise<IGrouper>;
  getMonthlyValuePerGrouper(
    gruperId: number,
    month: number,
    year: number,
    employmentId: number
  ): Promise<number>;
}
export default class PayrollGenerateRepository
  implements IPayrollGenerateRepository
{
  constructor() {}

  async getMonthlyValuePerGrouper(
    gruperId: number,
    month: number,
    year: number,
    employmentId: number
  ): Promise<number> {
    const incomes = await Income.query()
      .select("ING_VALOR as value", "IAG_SIGNO as sign")
      .join("PPL_PERIODOS_PLANILLA", "PPL_CODIGO", "ING_CODPPL_PLANILLA")
      .join(
        "IAG_INGRESOS_AGRUPADOR",
        "IAG_CODTIG_TIPO_INGRESO",
        "ING_CODTIG_TIPO_INGRESO"
      )
      .where("PPL_MES", month)
      .where("PPL_ANIO", year)
      .where("IAG_CODAGR_AGRUPADOR", gruperId)
      .where("ING_CODEMP_EMPLEO", employmentId);

    const toReturn = incomes.reduce(
      (sum, i) =>
        sum + Number(i.$extras.value) * (i.$extras.sign == "-" ? -1 : 1),
      0
    );

    return toReturn;
  }

  async getActiveEmploments(dateStart: Date): Promise<IEmployment[]> {
    const res = await Employment.query()
      .preload("worker")
      .preload("charges")
      .whereHas("typesContracts", (contractsQuery) => {
        contractsQuery.where("temporary", false);
      })
      .where("startDate", "<=", dateStart)
      .andWhere("state", "=", true);

    return res.map((i) => i.serialize() as IEmployment);
  }

  async getByIdGrouper(id: number): Promise<IGrouper> {
    const res = await Grouper.findByOrFail("id", id);

    return res.serialize() as IGrouper;
  }

  async getLicencesPeriodByEmployment(
    idEmployement: number,
    dateStart: DateTime,
    dateEnd: DateTime
  ) {
    const res = await Licence.query()
      .where("codEmployment", idEmployement)
      .whereBetween("dateStart", [dateStart.toString(), dateEnd.toString()])
      .andWhereBetween("dateEnd", [dateStart.toString(), dateEnd.toString()]);
    return res.map((i) => i.serialize() as ILicence);
  }
  // async getIncapacitiesPeriodByEmployment(
  //   idEmployement: number,
  //   dateStart: DateTime,
  //   dateEnd: DateTime
  // ) {}

  // async getVacationsPeriodByEmployment(
  //   idEmployement: number,
  //   dateStart: DateTime,
  //   dateEnd: DateTime
  // ) {}

  // async getEventualDeductionsByEmployment(
  //   idEmployement: number,
  //   codPayroll: number
  // ) {}

  // async getCyclicDeductionsByEmployment(
  //   idEmployement: number,
  //   codPayroll: number
  // ) {}
}
