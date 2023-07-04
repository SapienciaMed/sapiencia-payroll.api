import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class TypesContractsWithDrawal extends BaseModel {
  public static table = "TMR_TIPOS_MOTIVOS_RETIRO";

  @column({ isPrimary: true, columnName: "TMR_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TMR_NOMBRE", serializeAs: "name" })
  public name: string;
}
