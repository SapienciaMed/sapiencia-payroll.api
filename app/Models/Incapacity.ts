import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Incapacity extends BaseModel {
  public static table = "INC_INCAPACIDADES";

  @column({ isPrimary: true, columnName: "INC_CODIGO", serializeAs: "id" })
  public id: number;

  @column({
    isPrimary: true,
    columnName: "INC_CODEMP_EMPLEO",
    serializeAs: "employmentId",
  })
  public employmentId: number;
}
