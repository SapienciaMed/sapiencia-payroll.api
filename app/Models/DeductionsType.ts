import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class DeductionsType extends BaseModel {
  public static table = "TDD_TIPOS_DEDUCCIONES";
  @column({ isPrimary: true, columnName: "TDD_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TDD_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({
    columnName: "TDD_ES_CICLICA",
    serializeAs: "cyclic",
  })
  public cyclic: boolean;
}
