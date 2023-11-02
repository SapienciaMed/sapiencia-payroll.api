import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class CyclicalDeductionInstallment extends BaseModel {
  public static table = "CDC_CUOTAS_DEDUCCION_CICLICA";

  @column({ isPrimary: true, columnName: "CDC_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "CDC_CODPPL_PLANILLA", serializeAs: "idTypePayroll" })
  public idTypePayroll: number;

  @column({
    columnName: "CDC_CODDDM_DEDUCCION",
    serializeAs: "idDeductionManual",
  })
  public idDeductionManual: number;

  @column({ columnName: "CDC_NUMERO_CUOTA", serializeAs: "quotaNumber" })
  public quotaNumber: number;

  @column({ columnName: "CDC_VALOR_CUOTA", serializeAs: "quotaValue" })
  public quotaValue: number;

  @column({
    columnName: "CDC_APLICADO",
    serializeAs: "applied",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public applied: boolean;
}
