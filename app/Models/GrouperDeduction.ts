import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Grouper from "./Grouper";
import DeductionType from "./DeductionType";

export default class GrouperDeduction extends BaseModel {
  public static table = "DAG_DEDUCCIONES_AGRUPADOR";

  @column({ isPrimary: true, columnName: "DAG_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "DAG_CODAGR_AGRUPADOR", serializeAs: "idGrouper" })
  public idGrouper: number;

  @column({
    columnName: "DAG_CODTDD_TIPO_DEDUCCION",
    serializeAs: "idTypeDeduction",
  })
  public idTypeDeduction: number;

  @column({ columnName: "DAG_SIGNO", serializeAs: "sign" })
  public sign: string;

  @hasMany(() => Grouper, {
    localKey: "idGrouper",
    foreignKey: "id",
  })
  public grouper: HasMany<typeof Grouper>;

  @hasMany(() => DeductionType, {
    localKey: "idTypeDeduction",
    foreignKey: "id",
  })
  public deductionType: HasMany<typeof DeductionType>;
}
