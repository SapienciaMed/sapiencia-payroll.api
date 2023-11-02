import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class TypesIncapacity extends BaseModel {
  public static table = "TIN_TIPOS_INCAPACIDAD";

  @column({ isPrimary: true, columnName: "TIN_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TIN_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({ columnName: "TIN_AGRUPADOR_RANGO", serializeAs: "rangeGrouper" })
  public rangeGrouper: string;
}
