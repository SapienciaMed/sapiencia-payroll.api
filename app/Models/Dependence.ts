import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Dependencies extends BaseModel {
  public static table = "DEP_DEPENDENCIAS";

  @column({ isPrimary: true, columnName: "DEP_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "DEP_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({ columnName: "DEP_CODDEP_SUPERIOR", serializeAs: "depAbove" })
  public depAbove: number;
}
