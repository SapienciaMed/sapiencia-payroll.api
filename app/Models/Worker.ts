import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  HasOne,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Relative from "./Relative";
import Employment from "./Employment";
import Env from "@ioc:Adonis/Core/Env";

export default class Worker extends BaseModel {
  public static table = "TRA_TRABAJADORES";

  @column({ isPrimary: true, columnName: "TRA_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "TRA_TIPO_DOCUMENTO",
    serializeAs: "typeDocument",
  })
  public typeDocument: string;

  @column({
    columnName: "TRA_NUMERO_DOCUMENTO",
    serializeAs: "numberDocument",
  })
  public numberDocument: string;

  @column({
    columnName: "TRA_PRIMER_NOMBRE",
    serializeAs: "firstName",
  })
  public firstName: string;

  @column({
    columnName: "TRA_SEGUNDO_NOMBRE",
    serializeAs: "secondName",
    serialize: (value) => (!value ? "" : value),
  })
  public secondName: string;

  @column({
    columnName: "TRA_PRIMER_APELLIDO",
    serializeAs: "surname",
  })
  public surname: string;

  @column({
    columnName: "TRA_SEGUNDO_APELLIDO",
    serializeAs: "secondSurname",
    serialize: (value) => (!value ? "" : value),
  })
  public secondSurname: string;

  @column({
    columnName: "TRA_GENERO",
    serializeAs: "gender",
  })
  public gender: string;

  @column({
    columnName: "TRA_TIPO_SANGRE",
    serializeAs: "bloodType",
  })
  public bloodType: string;

  @column({
    columnName: "TRA_FECHA_NACIMIENTO",
    serializeAs: "birthDate",
  })
  public birthDate: DateTime;

  @column({
    columnName: "TRA_NACIONALIDAD",
    serializeAs: "nationality",
  })
  public nationality: string;

  @column({
    columnName: "TRA_CORREO_ELECTRONICO",
    serializeAs: "email",
  })
  public email: string;

  @column({
    columnName: "TRA_NUMERO_CONTACTO",
    serializeAs: "contactNumber",
  })
  public contactNumber: string;

  @column({
    columnName: "TRA_DEPARTAMENTO",
    serializeAs: "department",
  })
  public department: string;

  @column({
    columnName: "TRA_MUNICIPIO",
    serializeAs: "municipality",
  })
  public municipality: string;

  @column({
    columnName: "TRA_BARRIO",
    serializeAs: "neighborhood",
  })
  public neighborhood: string;

  @column({
    columnName: "TRA_DIRECCION",
    serializeAs: "address",
  })
  public address: string;

  @column({
    columnName: "TRA_ESTRATO_SOCIOECONOMICO",
    serializeAs: "socioEconomic",
  })
  public socioEconomic: string;

  @column({
    columnName: "TRA_EPS",
    serializeAs: "eps",
  })
  public eps: string;

  @column({
    columnName: "TRA_FONDO_CESANTIAS",
    serializeAs: "severanceFund",
  })
  public severanceFund: string;

  @column({
    columnName: "TRA_ARL",
    serializeAs: "arl",
  })
  public arl: string;

  @column({
    columnName: "TRA_NIVEL_RIESGO",
    serializeAs: "riskLevel",
  })
  public riskLevel: string;

  @column({
    columnName: "TRA_TIPO_VIVIENDA",
    serializeAs: "housingType",
  })
  public housingType: string;

  @column({
    columnName: "TRA_FONDO_PENSION",
    serializeAs: "fundPension",
  })
  public fundPension: string;

  @column({
    columnName: "TRA_BANCO",
    serializeAs: "bank",
  })
  public bank: string;

  @column({
    columnName: "TRA_TIPO_CUENTA_BANCARIA",
    serializeAs: "accountBankType",
  })
  public accountBankType: string;

  @column({
    columnName: "TRA_CUENTA_BANCARIA",
    serializeAs: "accountBankNumber",
  })
  public accountBankNumber: string;

  @column({
    columnName: "TRA_USUARIO_MODIFICO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "TRA_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateModified: DateTime;

  @column({
    columnName: "TRA_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string | undefined = Env.get("USER_ID");

  @column.dateTime({
    autoCreate: true,
    columnName: "TRA_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateCreate: DateTime;

  @hasMany(() => Relative, {
    localKey: "id",
    foreignKey: "workerId",
  })
  public relatives: HasMany<typeof Relative>;

  @hasOne(() => Employment, {
    localKey: "id",
    foreignKey: "workerId",
  })
  public employment: HasOne<typeof Employment>;
}
