import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Relative extends BaseModel {
  public static table = "FAM_FAMILIARES";

  @column({ isPrimary: true, columnName: "FAM_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "FAM_CODTRA_TRABAJADOR", serializeAs: "codWorker" })
  public codWorker: number;

  @column({ columnName: "FAM_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({ columnName: "FAM_PARENTESCO", serializeAs: "relationship" })
  public relationship: string;

  @column({ columnName: "FAM_GENERO", serializeAs: "gender" })
  public gender: string;

  @column.dateTime({ columnName: "FAM_GENERO", serializeAs: "birthDate" })
  public birthDate: DateTime;
}
