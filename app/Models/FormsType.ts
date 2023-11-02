import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class FormsType extends BaseModel {
  public static table = "TPL_TIPOS_PLANILLA";
  @column({ isPrimary: true, columnName: "TPL_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "TPL_ES_ESPECIAL",
    serializeAs: "special",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public special: boolean;

  @column({ columnName: "TPL_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({
    columnName: "TPL_FRECUENCIA",
    serializeAs: "frecuencyPaid",
  })
  public frecuencyPaid: string;
}
