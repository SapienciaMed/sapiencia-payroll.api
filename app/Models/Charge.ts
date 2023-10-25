import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import TypesCharge from "./TypesCharge";

export default class Charge extends BaseModel {
  public static table = "CRG_CARGOS";

  @column({ isPrimary: true, columnName: "CRG_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "CRG_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({
    columnName: "CRG_CODTCG_TIPO_CARGO",
    serializeAs: "codChargeType",
  })
  public codChargeType: number;

  @column({ columnName: "CRG_OBSERVACIONES", serializeAs: "observations" })
  public observations: string;

  @column({
    columnName: "CRG_SALARIO_BASE",
    serializeAs: "baseSalary",
  })
  public baseSalary: number;

  @column({
    columnName: "CRG_ACTIVO",
    serializeAs: "state",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public state: boolean;

  @column({
    columnName: "CRG_USUARIO_MODIFICO",
    serializeAs: "userModify",
  })
  public userModify: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "CRG_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateModified: DateTime;

  @column({
    columnName: "CRG_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "CRG_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateCreate: DateTime;


  @hasOne(() => TypesCharge, {
    localKey: "codChargeType",
    foreignKey: "id",
  })
  public typeCharge: HasOne<typeof TypesCharge>;
}
