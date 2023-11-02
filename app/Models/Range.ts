import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Range extends BaseModel {
  public static table = "RNG_RANGOS";

  @column({ isPrimary: true, columnName: "RNG_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "RNG_AGRUPADOR", serializeAs: "grouper" })
  public grouper: string;

  @column({
    columnName: "RNG_INICIO",
    serializeAs: "start",
  })
  public start: number;

  @column({ columnName: "RNG_FIN", serializeAs: "end" })
  public end: number;

  @column({ columnName: "RNG_VALOR", serializeAs: "value" })
  public value: number;

  @column({ columnName: "RNG_VALOR_2", serializeAs: "value2" })
  public value2: number;
}
