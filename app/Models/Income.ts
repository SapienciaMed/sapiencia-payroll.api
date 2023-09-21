import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import FormsPeriod from "./FormsPeriod";
import Employment from "./Employment";
import IncomeType from "./IncomeType";

export default class Income extends BaseModel {
  public static table = "ING_INGRESOS";

  @column({ isPrimary: true, columnName: "ING_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "ING_CODPPL_PLANILLA",
    serializeAs: "idTypePayroll",
  })
  public idTypePayroll: number;

  @column({
    columnName: "ING_CODEMP_EMPLEO",
    serializeAs: "idEmployment",
  })
  public idEmployment: number;

  @column({
    columnName: "ING_CODTIG_TIPO_INGRESO",
    serializeAs: "idTypeIncome",
  })
  public idTypeIncome: number;

  @column({
    columnName: "ING_VALOR",
    serializeAs: "value",
  })
  public value: number;

  @column({
    columnName: "ING_TIEMPO",
    serializeAs: "time",
  })
  public time: number;

  @column({
    columnName: "ING_UNIDAD_TIEMPO",
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

  @hasMany(() => IncomeType, {
    localKey: "idTypeIncome",
    foreignKey: "id",
  })
  public incomeType: HasMany<typeof IncomeType>;
}
