import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class ReserveType extends BaseModel {
  public static table = "TRS_TIPOS_RESERVAS";

  @column({ isPrimary: true, columnName: "TRS_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TRS_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({
    columnName: "TRD_CUENTA_CONTABLE",
    serializeAs: "accountingAccount",
  })
  public accountingAccount: string;
}
