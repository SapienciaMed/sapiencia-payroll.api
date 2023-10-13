import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class TaxDeductible extends BaseModel {
  public static table = "DER_DEDUCIBLES_RENTA";

  @column({ isPrimary: true, columnName: "DER_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ isPrimary: true, columnName: "DER_ANIO", serializeAs: "year" })
  public year: number;
}
