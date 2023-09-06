import { DateTime } from "luxon";
import {
  BaseModel,
  HasMany,
  HasOne,
  column,
  hasMany,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import Env from "@ioc:Adonis/Core/Env";
import Employment from "./Employment";
import DeductionsType from "./DeductionsType";

export default class ManualDeduction extends BaseModel {
  public static table = "DDM_DEDUCCIONES_MANUALES";

  @column({ isPrimary: true, columnName: "DDM_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "DDM_CODEMP_EMPLEO", serializeAs: "codEmployment" })
  public codEmployment: number;

  @column({
    columnName: "DDM_CODTDD_TIPO_DEDUCCION",
    serializeAs: "codDeductionType",
  })
  public codDeductionType: number;

  @column({ columnName: "DDM_ES_CICLICA", serializeAs: "cyclic" })
  public cyclic: boolean;

  @column({
    columnName: "DDM_NUMERO_CUOTAS",
    serializeAs: "numberInstallments",
  })
  public numberInstallments: number;

  @column({
    columnName: "DDM_APLICAR_EXTRAORINARIAS",
    serializeAs: "applyExtraordinary",
  })
  public applyExtraordinary: boolean;

  @column({ columnName: "DDM_VALOR", serializeAs: "value" })
  public value: number;

  @column({ columnName: "DDM_CODPPL", serializeAs: "codFormsPeriod" })
  public codFormsPeriod: number;

  @column({ columnName: "DDM_ESTADO", serializeAs: "state" })
  public state: string;
  
  @column({ columnName: "DDM_OBSERVACIONES", serializeAs: "observation" })
  public observation: string;

  @column({
    columnName: "DDM_USUARIO_MODIFICO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "DDM_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateModified: DateTime;

  @column({
    columnName: "DDM_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string | undefined = Env.get("USER_ID");

  @column.dateTime({
    autoCreate: true,
    columnName: "DDM_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateCreate: DateTime;

  @hasOne(() => Employment, {
    localKey: "codEmployment",
    foreignKey: "id",
  })
  public employment: HasOne<typeof Employment>;

  @hasMany(() => DeductionsType, {
    localKey: "codDeductionType",
    foreignKey: "id",
  })
  public deductionsType: HasMany<typeof DeductionsType>;
}
