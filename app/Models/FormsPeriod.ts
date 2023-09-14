import { DateTime } from "luxon";
import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Env from "@ioc:Adonis/Core/Env";
import FormsType from "./FormsType";

export default class FormsPeriod extends BaseModel {
  public static table = "PPL_PERIODOS_PLANILLA";

  @column({ isPrimary: true, columnName: "PPL_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "PPL_CODTPL_TIPO_PLANILLA",
    serializeAs: "idFormType",
  })
  public idFormType: number;

  @column({
    columnName: "PPL_MES",
    serializeAs: "month",
  })
  public month: number;

  @column({
    columnName: "PPL_ANIO",
    serializeAs: "year",
  })
  public year: number;

  @column({
    columnName: "PPL_FECHA_INICIO",
    serializeAs: "dateStart",
    prepare: (value: DateTime) => new Date(value?.toJSDate().setHours(2, 2, 2, 2)),
  })
  public dateStart: DateTime;

  @column({
    columnName: "PPL_FECHA_FIN",
    serializeAs: "dateEnd",
    prepare: (value: DateTime) => new Date(value?.toJSDate().setHours(2, 2, 2, 2)),
  })
  public dateEnd: DateTime;

  @column({
    columnName: "PPL_FECHA_PAGO",
    serializeAs: "paidDate",
    prepare: (value: DateTime) => new Date(value?.toJSDate().setHours(2, 2, 2, 2)),
  })
  public paidDate: DateTime;

  @column({ columnName: "PPL_ESTADO", serializeAs: "state" })
  public state: string;

  @column({ columnName: "PPL_OBSERVACIONES", serializeAs: "observation" })
  public observation: string;

  @column({
    columnName: "PPL_USUARIO_MODIFICO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "PPL_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: (value: DateTime) => new Date(value?.toJSDate().setHours(2, 2, 2, 2)),
  })
  public dateModified: DateTime;

  @column({
    columnName: "PPL_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string | undefined = Env.get("USER_ID");

  @column.dateTime({
    autoCreate: true,
    columnName: "PPL_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: (value: DateTime) => new Date(value?.toJSDate().setHours(2, 2, 2, 2)),
  })
  public dateCreate: DateTime;

  @hasMany(() => FormsType, {
    localKey: "idFormType",
    foreignKey: "id",
  })
  public formsType: HasMany<typeof FormsType>;
}
