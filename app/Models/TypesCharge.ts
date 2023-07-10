import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class TypesCharge extends BaseModel {
  public static table = "TCG_TIPOS_CARGOS";

  @column({ isPrimary: true, columnName: "TCG_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TCG_NOMBRE", serializeAs: "name" })
  public name: string;
}
