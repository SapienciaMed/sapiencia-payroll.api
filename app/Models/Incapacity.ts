import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Env from "@ioc:Adonis/Core/Env";
import TypesIncapacity from "./TypesIncapacity";
import Employment from "./Employment";

export default class Incapacity extends BaseModel {
  public static table = "INC_INCAPACIDADES";

  @column({ isPrimary: true, columnName: "INC_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "INC_CODTIN_TIPO_INCAPACIDAD",
    serializeAs: "codIncapacityType",
  })
  public codIncapacityType: number;

  @column({ columnName: "INC_CODEMP_EMPLEO", serializeAs: "codEmployment" })
  public codEmployment: number;

  @column({
    columnName: "INC_FECHA_INICIO",
    serializeAs: "dateInitial",
    prepare: (value: DateTime) => new Date(value.toJSDate()),
    serialize: (value: DateTime) => value.toJSDate(),
  })
  public dateInitial: DateTime;

  @column({
    columnName: "INC_FECHA_FIN",
    serializeAs: "dateFinish",
    prepare: (value: DateTime) => new Date(value.toJSDate()),
    serialize: (value: DateTime) => value.toJSDate(),
  })
  public dateFinish: DateTime;

  @column({ columnName: "INC_COMENTARIOS", serializeAs: "comments" })
  public comments: string;

  @column({
    columnName: "INC_ES_PRORROGA",
    serializeAs: "isExtension",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public isExtension: boolean;

  @column({ columnName: "INC_USUARIO_MODIFICO", serializeAs: "userModified" })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "INC_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateModified: DateTime;

  @column({ columnName: "INC_USUARIO_CREO", serializeAs: "userCreate" })
  public userCreate: string | undefined = Env.get("USER_ID");

  @column.dateTime({
    autoCreate: true,
    columnName: "INC_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateCreate: DateTime;

  @hasOne(() => TypesIncapacity, {
    localKey: "codIncapacityType",
    foreignKey: "id",
  })
  public typeIncapacity: HasOne<typeof TypesIncapacity>;

  @hasOne(() => Employment, {
    localKey: "codEmployment",
    foreignKey: "id",
  })
  public employment: HasOne<typeof Employment>;
}
