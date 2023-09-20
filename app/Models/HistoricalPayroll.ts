import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class HistoricalPayroll extends BaseModel {
  public static table = "HPL_HISTORICOS_PLANILLA";

  @column({ isPrimary: true, columnName: "HPL_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "HPL_CODPPL_PLANILLA",
    serializeAs: "idTypePayroll",
  })
  public idTypePayroll: number;

  @column({
    columnName: "HPL_CODEMP_EMPLEO",
    serializeAs: "idEmployment",
  })
  public idEmployment: number;

  @column({
    columnName: "HPL_DIAS_TRABAJADOS",
    serializeAs: "workedDays",
  })
  public workedDay: number;

  @column({
    columnName: "HPL_SALARIO",
    serializeAs: "salary",
  })
  public salary: number;

  @column({
    columnName: "HPL_TOTAL_INGRESOS",
    serializeAs: "totalIncome",
  })
  public totalIncome: number;

  @column({
    columnName: "HPL_TOTAL_DEDUCCIONES",
    serializeAs: "totalDeductions",
  })
  public totalDeduction: number;

  @column({
    columnName: "HPL_TOTAL",
    serializeAs: "total",
  })
  public total: number;

  @column({
    columnName: "HPL_ESTADO",
    serializeAs: "state",
  })
  public state: string;

  @column({
    columnName: "HPL_OBSERVACIONES",
    serializeAs: "observations",
  })
  public observation: string;
}
