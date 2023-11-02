import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Employment from "./Employment";

export default class TaxDeductible extends BaseModel {
  public static table = "DER_DEDUCIBLES_RENTA";

  @column({ isPrimary: true, columnName: "DER_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "DER_ANIO", serializeAs: "year" })
  public year: number;

  @column({ columnName: "DER_CODEMP_EMPLEO", serializeAs: "codEmployment" })
  public codEmployment: number;

  @column({ columnName: "DER_TIPO", serializeAs: "type" })
  public type: string;

  @column({ columnName: "DER_VALOR", serializeAs: "value" })
  public value: number;

  @column({ columnName: "DER_ESTADO", serializeAs: "state" })
  public state: string;

  @column({
    columnName: "DER_USUARIO_MODIFICO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "DER_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateModified: DateTime;

  @column({
    columnName: "DER_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "DER_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateCreate: DateTime;

  @belongsTo(() => Employment, {
    localKey: "id",
    foreignKey: "codEmployment",
  })
  public employment: BelongsTo<typeof Employment>;
}
