import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Worker extends BaseModel {
  public static table = "TRA_TRABAJADORES";

  @column({ isPrimary: true, columnName: "TRA_CODIGO", serializeAs: "id" })
  public id: number;
}
