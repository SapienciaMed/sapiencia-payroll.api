import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  hasOne,
  HasOne,
} from "@ioc:Adonis/Lucid/Orm";
import Employment from "./Employment";
import IncomeType from "./IncomeType";
import FormsPeriod from "./FormsPeriod";

export default class OtherIncome extends BaseModel {
  public static table = "OIN_OTROS_INGRESOS";

  @column({ isPrimary: true, columnName: "OIN_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "OIN_CODEMP_EMPLEO", serializeAs: "codEmployment" })
  public codEmployment: number;

  @column({
    columnName: "OIN_CODTIG_TIPO_INGRESO",
    serializeAs: "codTypeIncome",
  })
  public codTypeIncome: number;

  @column({ columnName: "OIN_CODPPL_PLANILLA", serializeAs: "codPayroll" })
  public codPayroll: number;

  @column({ columnName: "OIN_VALOR", serializeAs: "value" })
  public value: number;

  @column({ columnName: "OIN_ESTADO", serializeAs: "state" })
  public state: string;

  @column({
    columnName: "OIN_USUARIO_MODIFICO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "OIN_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateModified: DateTime;

  @column({
    columnName: "OIN_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "OIN_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateCreate: DateTime;

  @belongsTo(() => Employment, {
    localKey: "id",
    foreignKey: "codEmployment",
  })
  public employment: BelongsTo<typeof Employment>;

  @hasOne(() => IncomeType, {
    localKey: "codTypeIncome",
    foreignKey: "id",
  })
  public incomeType: HasOne<typeof IncomeType>;

  @hasOne(() => FormsPeriod, {
    localKey: "codPayroll",
    foreignKey: "id",
  })
  public payroll: HasOne<typeof FormsPeriod>;
}
