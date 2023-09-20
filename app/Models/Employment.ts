import { DateTime } from "luxon";
import {
  BaseModel,
  HasMany,
  column,
  hasMany,
  belongsTo,
  BelongsTo,
} from "@ioc:Adonis/Lucid/Orm";
import Charge from "./Charge";
import TypesContract from "./TypesContract";
import Worker from "./Worker";
import ReasonsForWithdrawal from "./ReasonsForWithdrawal";

export default class Employment extends BaseModel {
  public static table = "EMP_EMPLEOS";

  @column({ isPrimary: true, columnName: "EMP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "EMP_CODTRA_TRABAJADOR", serializeAs: "workerId" })
  public workerId: number;

  @column({
    columnName: "EMP_CODCRG_CARGO",
    serializeAs: "idCharge",
  })
  public idCharge: number;

  @column({
    columnName: "EMP_CORREO_INSTITUCIONAL",
    serializeAs: "institutionalMail",
  })
  public institutionalMail: string;

  @column({
    columnName: "EMP_CODTCO_TIPO_CONTRATO",
    serializeAs: "idTypeContract",
  })
  public idTypeContract: number;

  @column({
    columnName: "EMP_NUMERO_CONTRATO",
    serializeAs: "contractNumber",
  })
  public contractNumber: string;

  @column.date({
    columnName: "EMP_FECHA_INICIO",
    serializeAs: "startDate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public startDate: DateTime;

  @column.date({
    columnName: "EMP_FECHA_FIN",
    serializeAs: "endDate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public endDate: DateTime;

  @column({
    columnName: "EMP_ESTADO",
    serializeAs: "state",
  })
  public state: string;

  @column({
    columnName: "EMP_CODTMR_MOTIVO_RETIRO",
    serializeAs: "idReasonRetirement",
  })
  public idReasonRetirement: number;

  @column.date({
    columnName: "EMP_FECHA_RETIRO",
    serializeAs: "retirementDate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public retirementDate: DateTime;

  @column({
    columnName: "EMP_SALARIO",
    serializeAs: "salary",
  })
  public salary: number;
  @column({
    columnName: "EMP_VALOR_TOTAL",
    serializeAs: "totalValue",
  })
  public totalValue: number;
  @column({
    columnName: "EMP_OBSERVACION",
    serializeAs: "observation",
  })
  public observation: string;

  @column({
    columnName: "EMP_USUARIO_MODIFICO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "EMP_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateModified: DateTime;

  @column({
    columnName: "EMP_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string;

  @column.dateTime({
    autoCreate: true,
    columnName: "EMP_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateCreate: DateTime;

  @hasMany(() => Charge, {
    localKey: "idCharge",
    foreignKey: "id",
  })
  public charges: HasMany<typeof Charge>;

  @hasMany(() => ReasonsForWithdrawal, {
    localKey: "idReasonRetirement",
    foreignKey: "id",
  })
  public reasonsForWithdrawal: HasMany<typeof ReasonsForWithdrawal>;

  @hasMany(() => TypesContract, {
    localKey: "idTypeContract",
    foreignKey: "id",
  })
  public typesContracts: HasMany<typeof TypesContract>;

  @belongsTo(() => Worker, {
    localKey: "id",
    foreignKey: "workerId",
  })
  public worker: BelongsTo<typeof Worker>;
}
