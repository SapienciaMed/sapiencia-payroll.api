import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

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
}
