import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Deduction extends BaseModel {
  public static table = "DED_DEDUCCIONES";

  @column({ isPrimary: true, columnName: "DED_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "DED_CODPPL_PLANILLA",
    serializeAs: "idTypePayroll",
  })
  public idTypePayroll: number;

  @column({
    columnName: "DED_CODEMP_EMPLEO",
    serializeAs: "idEmployment",
  })
  public idEmployment: number;

  @column({
    columnName: "DED_CODTDD_TIPO_DEDUCCION",
    serializeAs: "idTypeDeduction",
  })
  public idTypeDeduction: number;

  @column({
    columnName: "DED_VALOR",
    serializeAs: "value",
  })
  public value: number;

  @column({
    columnName: "DED_VALOR_PATRONAL",
    serializeAs: "patronalValue",
  })
  public patronalValue: number;

  @column({
    columnName: "DED_TIEMPO",
    serializeAs: "time",
  })
  public time: number;

  @column({
    columnName: "DED_UNIDAD_TIEMPO",
    serializeAs: "unitTime",
  })
  public unitTime: string;
}
