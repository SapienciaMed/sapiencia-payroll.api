import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Grouper from "./Grouper";
import IncomeType from "./IncomeType";

export default class GrouperIncome extends BaseModel {
  public static table = "IAG_INGRESOS_AGRUPADOR";

  @column({ isPrimary: true, columnName: "IAG_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "IAG_CODAGR_AGRUPADOR", serializeAs: "idGrouper" })
  public idGrouper: number;

  @column({
    columnName: "IAG_CODTIG_TIPO_INGRESO",
    serializeAs: "idTypeIncome",
  })
  public idTypeIncome: number;

  @column({ columnName: "IAG_SIGNO", serializeAs: "sign" })
  public sign: string;

  @hasMany(() => Grouper, {
    localKey: "idGrouper",
    foreignKey: "id",
  })
  public grouper: HasMany<typeof Grouper>;

  @hasMany(() => IncomeType, {
    localKey: "idTypeIncome",
    foreignKey: "id",
  })
  public incomeType: HasMany<typeof IncomeType>;
}
