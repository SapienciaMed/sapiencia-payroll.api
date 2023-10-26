import { BaseModel, HasMany, belongsTo, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Employment from "./Employment";
import FormsPeriod from "./FormsPeriod";
import DeductionType from "./DeductionType";

export default class Deduction extends BaseModel {
  public static table = "DED_DEDUCCIONES";

  @column({ isPrimary: true, columnName: "DED_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "DED_CODPPL_PLANILLA",
    serializeAs: "idTypePayroll",
  })
  public idTypePayroll: number;

  @column({
    columnName: "DED_CODEMP_EMPLEO",
    serializeAs: "idEmployment",
  })
  public idEmployment: number;

  @column({
    columnName: "DED_CODTDD_TIPO_DEDUCCION",
    serializeAs: "idTypeDeduction",
  })
  public idTypeDeduction: number;

  @column({
    columnName: "DED_VALOR",
    serializeAs: "value",
  })
  public value: number;

  @column({
    columnName: "DED_VALOR_PATRONAL",
    serializeAs: "patronalValue",
  })
  public patronalValue: number;

  @column({
    columnName: "DED_TIEMPO",
    serializeAs: "time",
  })
  public time: number;

  @column({
    columnName: "DED_UNIDAD_TIEMPO",
    serializeAs: "unitTime",
  })
  public unitTime: string;

  @hasMany(() => FormsPeriod, {
    localKey: "idTypePayroll",
    foreignKey: "id",
  })
  public formPeriod: HasMany<typeof FormsPeriod>;

  @hasMany(() => Employment, {
    localKey: "idEmployment",
    foreignKey: "id",
  })
  public employment: HasMany<typeof Employment>;

  @hasMany(() => DeductionType, {
    localKey: "idTypeDeduction",
    foreignKey: "id",
  })
  public deductionType: HasMany<typeof DeductionType>;
}
