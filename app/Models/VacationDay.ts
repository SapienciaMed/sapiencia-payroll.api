import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Env from "@ioc:Adonis/Core/Env";
import Vacation from "./Vacation";
import Employment from "./Employment";
import FormsPeriod from "./FormsPeriod";

export default class VacationDay extends BaseModel {
  public static table = "DVA_DIAS_VACACIONES";

  @column({ isPrimary: true, columnName: "DVA_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "DVA_CODVAC_VACACION", serializeAs: "codVacation" })
  public codVacation: number;

  @column.dateTime({
    autoCreate: false,
    columnName: "DVA_FECHA_DESDE",
    serializeAs: "dateFrom",
  })
  public dateFrom: DateTime;

  @column.dateTime({
    autoCreate: false,
    columnName: "DVA_FECHA_HASTA",
    serializeAs: "dateUntil",
  })
  public dateUntil: DateTime;

  @column({ columnName: "DVA_DIAS", serializeAs: "enjoyedDays" })
  public enjoyedDays: number;

  @column({
    columnName: "DVA_PAGADAS",
    serializeAs: "paid",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public paid: boolean;

  @column({ columnName: "DVA_CODPPL_PLANILLA", serializeAs: "codForm" })
  public codForm: number;

  @column({ columnName: "DVA_OBSERVACIONES", serializeAs: "observation" })
  public observation: string;

  @column({ columnName: "DVA_TIPO_REINTEGRO", serializeAs: "refundType" })
  public refundType: string;

  @column({
    columnName: "DVA_USUARIO_CREO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "DVA_FECHA_MODIFICO",
    serializeAs: "dateModified",
    //prepare: () => DateTime.now().toSQL(),
  })
  public dateModified: DateTime;

  @column({
    columnName: "DVA_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string | undefined = Env.get("USER_ID");

  @column.dateTime({
    autoCreate: true,
    columnName: "DVA_FECHA_CREO",
    serializeAs: "dateCreate",
    //prepare: () => DateTime.now().toSQL(),
  })
  public dateCreate: DateTime;

  @hasOne(() => FormsPeriod, {
    localKey: "codForm",
    foreignKey: "id",
  })
  public formPeriod: HasOne<typeof FormsPeriod>;

  @hasOne(() => Vacation, {
    localKey: "codVacation",
    foreignKey: "id",
  })
  public vacation: HasOne<typeof Vacation>;
}
