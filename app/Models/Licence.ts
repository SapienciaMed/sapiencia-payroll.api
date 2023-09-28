import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  HasOne,
  belongsTo,
  column,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import Employment from "./Employment";
import LicenceType from "./LicenceType";

export default class Licence extends BaseModel {
  public static table = "LIC_LICENCIAS";

  @column({ isPrimary: true, columnName: "LIC_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "LIC_CODEMP_EMPLEO", serializeAs: "codEmployment" })
  public codEmployment: number;

  @column({
    columnName: "LIC_CODTLC_TIPO_LICENCIA",
    serializeAs: "idLicenceType",
  })
  public idLicenceType: number;

  @column.date({
    columnName: "LIC_FECHA_INICIO",
    serializeAs: "dateStart",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public dateStart: DateTime;

  @column.date({
    columnName: "LIC_FECHA_FIN",
    serializeAs: "dateEnd",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public dateEnd: DateTime;

  @column({
    columnName: "LIC_NUMERO_RESOLUCION",
    serializeAs: "resolutionNumber",
  })
  public resolutionNumber: string;

  @column({ columnName: "LIC_ESTADO", serializeAs: "licenceState" })
  public licenceState: string;

  @column({ columnName: "LIC_OBSERVACIONES", serializeAs: "observation" })
  public observation: string;

  @hasOne(() => Employment, {
    localKey: "codEmployment",
    foreignKey: "id",
  })
  public employment: HasOne<typeof Employment>;

  //   @belongsTo(() => LicenceType, {
  //     localKey: "idLicenceType",
  //     foreignKey: "id",
  //     serializeAs: "licenceType",
  //   })
  //   public licenceType: BelongsTo<typeof LicenceType>;

  @hasOne(() => LicenceType, {
    localKey: "idLicenceType",
    foreignKey: "id",
  })
  public licenceType: HasOne<typeof LicenceType>;
}
