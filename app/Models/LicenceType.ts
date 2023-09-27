import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class LicenceType extends BaseModel {
  public static table = "TLC_TIPOS_LICENCIAS";
  @column({ isPrimary: true, columnName: "TLC_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "TLC_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({ columnName: "TLC_ES_REMUNERADA", serializeAs: "paid" })
  public paid: boolean;

  @column({
    columnName: "TLC_NUMERO_DIAS",
    serializeAs: "numberDays",
  })
  public numberDays: number;

  @column({
    columnName: "TLC_TIPO_DIAS",
    serializeAs: "daysType",
  })
  public daysType: string;
}
