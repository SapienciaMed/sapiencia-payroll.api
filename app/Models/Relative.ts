import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Relative extends BaseModel {
  public static table = "FAM_FAMILIARES";

  @column({ isPrimary: true, columnName: "FAM_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "FAM_CODTRA_TRABAJADOR", serializeAs: "workerId" })
  public workerId: number;

  @column({ columnName: "FAM_NOMBRE", serializeAs: "name" })
  public name: string;

  @column({ columnName: "FAM_PARENTESCO", serializeAs: "relationship" })
  public relationship: string;

  @column({ columnName: "FAM_GENERO", serializeAs: "gender" })
  public gender: string;

  @column.date({
    columnName: "FAM_FECHA_NACIMIENTO",
    serializeAs: "birthDate",
    prepare: (value: DateTime) => new Date(value?.toJSDate()),
    serialize: (value: DateTime) => {
      return value ? value.setLocale("zh").toFormat("yyyy/MM/dd") : value;
    },
  })
  public birthDate: DateTime;
}
