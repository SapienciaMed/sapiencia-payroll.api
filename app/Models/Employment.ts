import { DateTime } from "luxon";
import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import TypesContractsWithDrawal from "./ReasonsForWithdrawal";
import Charge from "./Charge";

export default class Employment extends BaseModel {
  public static table = "EMP_EMPLEOS";

  @column({ isPrimary: true, columnName: "EMP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "EMP_CODTRA_TRABAJADOR", serializeAs: "workerId" })
  public workerId: number;

  @column({
    columnName: "EMP_CODCRG_CARGO",
    serializeAs: "codCharge",
  })
  public codCharge: number;

  @column({
    columnName: "EMP_NUMERO_CONTRATO",
    serializeAs: "contractNumber",
  })
  public contractNumber: string;

  @column.dateTime({
    columnName: "EMP_FECHA_INICIO",
    serializeAs: "startDate",
  })
  public startDate: DateTime;

  @column.dateTime({
    columnName: "EMP_FECHA_FIN",
    serializeAs: "endDate",
  })
  public endDate: DateTime;

  @column({
    columnName: "EMP_ESTADO",
    serializeAs: "state",
  })
  public state: string;

  @column({
    columnName: "EMP_CODTMR_MOTIVO_RETIRO",
    serializeAs: "codReasonRetirement",
  })
  public codReasonRetirement: number;

  @column({
    columnName: "EMP_USUARIO_MODIFICO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "EMP_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateModified: DateTime;

  @column({
    columnName: "EMP_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "EMP_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateCreate: DateTime;

  @hasMany(() => Charge, {
    localKey: "codCharge",
    foreignKey: "id",
  })
  public charges: HasMany<typeof Charge>;

  @hasMany(() => TypesContractsWithDrawal, {
    localKey: "codReasonRetirement",
    foreignKey: "id",
  })
  public typesContractsWithDrawals: HasMany<typeof TypesContractsWithDrawal>;
}
