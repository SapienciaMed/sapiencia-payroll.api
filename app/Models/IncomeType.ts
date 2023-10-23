import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class IncomeType extends BaseModel {
  public static table = "TIG_TIPOS_INGRESO";

  @column({ isPrimary: true, columnName: "TIG_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TIG_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({
    columnName: "TIG_CUENTA_CONTABLE",
    serializeAs: "accountingAccount",
  })
  public accountingAccount: string;

  @column({ columnName: "TIG_TIPO", serializeAs: "type" })
  public type: string;
}
