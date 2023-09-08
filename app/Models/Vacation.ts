import { DateTime } from "luxon";
import {
  BaseModel,
  HasMany,
  HasOne,
  column,
  hasMany,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import Employment from "./Employment";
import VacationDay from "./VacationDay";

export default class Vacation extends BaseModel {
  public static table = "VAC_VACACIONES";

  @column({ isPrimary: true, columnName: "VAC_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "VAC_CODEMP_EMPLEO", serializeAs: "codEmployment" })
  public codEmployment: number;

  @column({ columnName: "VAC_PERIODO", serializeAs: "period" })
  public period: number;

  @column({
    columnName: "VAC_FECHA_DESDE",
    serializeAs: "dateFrom",
    prepare: (value: DateTime) => new Date(value.toJSDate()),
  })
  public dateFrom: Date;

  @column({
    columnName: "VAC_FECHA_HASTA",
    serializeAs: "dateUntil",
    prepare: (value: DateTime) => new Date(value.toJSDate()),
  })
  public dateUntil: Date;

  @column({ columnName: "VAC_PERIODO_ANTERIOR", serializeAs: "periodFormer" })
  public periodFormer: number;

  @column({ columnName: "VAC_DISFRUTADOS", serializeAs: "enjoyed" })
  public enjoyed: number;

  @column({ columnName: "VAC_DIAS_REINTEGRADOS", serializeAs: "refund" })
  public refund: number;

  @column({ columnName: "VAC_DISPONIBLES", serializeAs: "available" })
  public available: number;

  @column({ columnName: "VAC_DIAS", serializeAs: "days" })
  public days: number;

  @column({
    columnName: "VAC_PERIODO_CERRADO",
    serializeAs: "periodClosed",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public periodClosed: boolean;

  @hasOne(() => Employment, {
    localKey: "codEmployment",
    foreignKey: "id",
  })
  public employment: HasOne<typeof Employment>;

  @hasMany(() => VacationDay, {
    localKey: "id",
    foreignKey: "codVacation",
  })
  public vacationDay: HasMany<typeof VacationDay>;
}
