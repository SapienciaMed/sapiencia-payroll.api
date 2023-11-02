import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Incapacity from "./Incapacity";
import FormsPeriod from "./FormsPeriod";

export default class IncapacityDaysProcessed extends BaseModel {
  public static table = "DIP_DIAS_INCAPACIDAD_PROCESADOS";
  @column({ isPrimary: true, columnName: "DIP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "DIP_CODINC_INCAPACIDAD", serializeAs: "codIncapcity" })
  public codIncapcity: number;

  @column({ columnName: "DIP_CODPPL_PLANILLA", serializeAs: "codFormPeriod" })
  public codFormPeriod: number;

  @column.date({
    columnName: "DIP_FECHA_INICIO",
    serializeAs: "startDate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public startDate: DateTime;

  @column.date({
    columnName: "DIP_FECHA_FIN",
    serializeAs: "endDate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public endDate: DateTime;

  @column({ columnName: "DIP_DIAS", serializeAs: "days" })
  public days: number;

  @hasOne(() => Incapacity, {
    localKey: "codIncapcity",
    foreignKey: "id",
  })
  public incapacity: HasOne<typeof Incapacity>;

  @hasOne(() => FormsPeriod, {
    localKey: "codFormPeriod",
    foreignKey: "id",
  })
  public formPeriod: HasOne<typeof FormsPeriod>;
}
