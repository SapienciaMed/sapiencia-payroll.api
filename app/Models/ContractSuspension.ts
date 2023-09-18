import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Env from "@ioc:Adonis/Core/Env";
import Employment from "./Employment";

export default class ContractSuspension extends BaseModel {
  public static table = "SCO_SUSPENCION_CONTRATOS";

  @column({ isPrimary: true, columnName: "SCO_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "SCO_CODEMP_EMPLEO", serializeAs: "codEmployment" })
  public codEmployment: number;

  @column.date({
    columnName: "SCO_FECHA_INICIO",
    serializeAs: "dateStart",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale('zh').toLocaleString() : value;
    },
  })
  public dateStart: DateTime;

  @column.date({
    columnName: "SCO_FECHA_FIN",
    serializeAs: "dateEnd",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale('zh').toLocaleString() : value;
    },
  })
  public dateEnd: DateTime;

  @column({
    columnName: "SCO_AJUSTA_FECHA_FIN",
    serializeAs: "adjustEndDate",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public adjustEndDate: boolean;

  @column.date({
    columnName: "SCO_NUEVA_FECHA_FIN",
    serializeAs: "newDateEnd",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale('zh').toLocaleString() : value;
    },
  })
  public newDateEnd: DateTime;

  @column({ columnName: "SCO_OBSERVACIONES", serializeAs: "observation" })
  public observation: string;

  @column({
    columnName: "SCO_USUARIO_MODIFICO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "SCO_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateModified: DateTime;

  @column({
    columnName: "SCO_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string | undefined = Env.get("USER_ID");

  @column.dateTime({
    autoCreate: true,
    columnName: "SCO_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateCreate: DateTime;

  @hasOne(() => Employment, {
    localKey: "codEmployment",
    foreignKey: "id",
  })
  public employment: HasOne<typeof Employment>;
}
