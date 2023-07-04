import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Unit extends BaseModel {
  public static table = "UNI_UNIDADES";

  @column({ isPrimary: true, columnName: "UNI_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "UNI_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({ columnName: "UNI_CODUNI_SUPERIOR", serializeAs: "uniAbove" })
  public uniAbove: number;
}
