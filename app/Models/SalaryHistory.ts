import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class SalaryHistory extends BaseModel {
  @column({ isPrimary: true, columnName: "HPA_CODIGO", serializeAs: "id" })
  public id: number;

  
  @column({
    columnName: "HPA_CODEMP_EMPLEO",
    serializeAs: "codEmployment",
  })
  public codEmployment: number;
  
  @column({
    columnName: "HPA_CODISA_INCREMENTO",
    serializeAs: "codIncrement",
  })
  public codIncrement: number;
  
  @column({ columnName: "HPA_SALARIO_ANTERIOR", serializeAs: "previousSalary" })
  public previousSalary: number;
  
  @column({ columnName: "HPA_SALARIO", serializeAs: "salary" })
  public salary: number;
  
  @column({
    columnName: "HPA_ES_VIGENTE",
    serializeAs: "validity",
  })
  public validity: boolean;
  
  @column.dateTime({
    autoCreate: false,
    columnName: "HPA_FECHA_VIGENCIA",
    serializeAs: "effectiveDate",
  })
  public effectiveDate: DateTime;
  
}
