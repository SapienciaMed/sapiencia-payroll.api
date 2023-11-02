import { DateTime } from "luxon";
import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Env from "@ioc:Adonis/Core/Env";
import FormsType from "./FormsType";
import Income from "./Income";
import Deduction from "./Deduction";
import Booking from "./Booking";
import HistoricalPayroll from "./HistoricalPayroll";

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

  @column.date({
    columnName: "PPL_FECHA_INICIO",
    serializeAs: "dateStart",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public dateStart: DateTime;

  @column.date({
    columnName: "PPL_FECHA_FIN",
    serializeAs: "dateEnd",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public dateEnd: DateTime;

  @column.date({
    columnName: "PPL_FECHA_PAGO",
    serializeAs: "paidDate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public paidDate: DateTime;

  @column({ columnName: "PPL_ESTADO", serializeAs: "state" })
  public state: string;

  @column({ columnName: "PPL_OBSERVACION", serializeAs: "observation" })
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
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
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
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
  })
  public dateCreate: DateTime;

  @hasMany(() => FormsType, {
    localKey: "idFormType",
    foreignKey: "id",
  })
  public formsType: HasMany<typeof FormsType>;

  @hasMany(() => Income, {
    localKey: "id",
    foreignKey: "idTypePayroll",
  })
  public incomes: HasMany<typeof Income>;

  @hasMany(() => Deduction, {
    localKey: "id",
    foreignKey: "idTypePayroll",
  })
  public deductions: HasMany<typeof Deduction>;

  @hasMany(() => Booking, {
    localKey: "id",
    foreignKey: "idTypePayroll",
  })
  public reserves: HasMany<typeof Booking>;

  @hasMany(() => HistoricalPayroll, {
    localKey: "id",
    foreignKey: "idTypePayroll",
  })
  public historicalPayroll: HasMany<typeof HistoricalPayroll>;
}
