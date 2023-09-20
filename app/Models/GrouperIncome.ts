import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class GrouperIncome extends BaseModel {
  public static table = "IAG_INGRESOS_AGRUPADOR";

  @column({ isPrimary: true, columnName: "IAG_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "IAG_CODAGR_AGRUPADOR", serializeAs: "idGrouper" })
  public idGrouper: number;

  @column({ columnName: "IAG_CODTIG_TIPO_INGRESO", serializeAs: "idIncome" })
  public idTypeIncome: number;

  @column({ columnName: "IAG_SIGNO", serializeAs: "sign" })
  public sign: string;
}
