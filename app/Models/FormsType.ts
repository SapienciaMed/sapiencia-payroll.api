import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class FormsType extends BaseModel {
  public static table = "TPL_TIPOS_PLANILLA";
  @column({ isPrimary: true, columnName: "TPL_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TPL_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({
    columnName: "TPL_FRECUENCIA",
    serializeAs: "frecuencyPaid",
  })
  public frecuencyPaid: string;
}
