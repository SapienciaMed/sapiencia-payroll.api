import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Booking extends BaseModel {
  public static table = "RSV_RESERVAS";

  @column({ isPrimary: true, columnName: "RSV_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    columnName: "RSV_CODPPL_PLANILLA",
    serializeAs: "idTypePayroll",
  })
  public idTypePayroll: number;

  @column({
    columnName: "RSV_CODEMP_EMPLEO",
    serializeAs: "idEmployment",
  })
  public idEmployment: number;

  @column({
    columnName: "RSV_CODTDD_TIPO_DEDUCCION",
    serializeAs: "idTypeDeduction",
  })
  public idTypeDeduction: number;

  @column({
    columnName: "RSV_VALOR",
    serializeAs: "value",
  })
  public value: number;

  @column({
    columnName: "RSV_TIEMPO",
    serializeAs: "time",
  })
  public time: number;

  @column({
    columnName: "RSV_UNIDAD_TIEMPO",
    serializeAs: "unitTime",
  })
  public unitTime: string;
}
