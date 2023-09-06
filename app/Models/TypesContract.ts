import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class TypesContract extends BaseModel {
  public static table = "TCO_TIPOS_CONTRATO";

  @column({ isPrimary: true, columnName: "TCO_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TCO_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({
    columnName: "TCO_ES_TEMPORAL",
    serializeAs: "temporary",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public temporary: boolean;
}
