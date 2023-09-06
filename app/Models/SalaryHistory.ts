import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Employment from "./Employment";
import SalaryIncrement from "./SalaryIncrement";

export default class SalaryHistory extends BaseModel {
  public static table = "HSA_HISTORICOS_SALARIALES";
  @column({ isPrimary: true, columnName: "HPA_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "HPA_CODEMP_EMPLEO",
    serializeAs: "codEmployment",
  })
  public codEmployment: number;

  @column({
    columnName: "HPA_CODISA_INCREMENTO",
    serializeAs: "codIncrement",
  })
  public codIncrement: number;

  @column({ columnName: "HPA_SALARIO_ANTERIOR", serializeAs: "previousSalary" })
  public previousSalary: number;

  @column({ columnName: "HPA_SALARIO", serializeAs: "salary" })
  public salary: number;

  @column({
    columnName: "HPA_ES_VIGENTE",
    serializeAs: "validity",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public validity: boolean;

  @column.dateTime({
    autoCreate: false,
    columnName: "HPA_FECHA_VIGENCIA",
    serializeAs: "effectiveDate",
  })
  public effectiveDate: DateTime;

  @hasOne(() => Employment, {
    localKey: "codEmployment",
    foreignKey: "id",
  })
  public employment: HasOne<typeof Employment>;

  @hasOne(() => SalaryIncrement, {
    localKey: "codIncrement",
    foreignKey: "id",
  })
  public salaryIncrement: HasOne<typeof SalaryIncrement>;
}
