import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Grouper extends BaseModel {
  public static table = "AGR_AGRUPADORES";

  @column({ isPrimary: true, columnName: "AGR_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "AGR_NOMBRE", serializeAs: "name" })
  public name: string;
}
