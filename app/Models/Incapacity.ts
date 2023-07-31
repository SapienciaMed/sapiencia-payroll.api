import { DateTime } from 'luxon';
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm';
import Env from "@ioc:Adonis/Core/Env";
import TypesIncapacity from "./TypesIncapacity";

export default class Incapacity extends BaseModel {

  public static table = "INC_INCAPACIDADES";

  @column({ isPrimary: true,
            columnName: "INC_CODIGO",
            serializeAs: "id" })
  public id: number;

  @column({ columnName: "INC_CODTIN_TIPO_INCAPACIDAD",
            serializeAs: "codIncapacityType" })
  public codIncapacityType: number;

  @column({ columnName: "INC_CODEMP_EMPLEO",
            serializeAs: "codEmployee", })
  public codEmployee: number;

  @column.dateTime({ columnName: "INC_FECHA_INICIO",
                     serializeAs: "dateInitial" })
  public dateInitial: DateTime;

  @column.dateTime({ columnName: "INC_FECHA_FIN",
                     serializeAs: "dateFinish" })
  public dateFinish: DateTime;

  @column({ columnName: "INC_COMENTARIOS",
            serializeAs: "comments" })
  public comments: string;

  @column({ columnName: "INC_ES_PRORROGA",
            serializeAs: "isExtension" })
  public isExtension: boolean;

  @column({ columnName: "INC_USUARIO_MODIFICO",
            serializeAs: "userModified" })
  public userModified: string;

  @column.dateTime({ autoUpdate: true,
                     columnName: "INC_FECHA_MODIFICO",
                     serializeAs: "dateModified",
                     prepare: () => DateTime.now().toSQL() })
  public dateModified: DateTime;

  @column({ columnName: "INC_USUARIO_CREO",
            serializeAs: "userCreate" })
  public userCreate: string | undefined = Env.get("USER_ID");

  @column.dateTime({ autoCreate: true,
                     columnName: "INC_FECHA_CREO",
                     serializeAs: "dateCreate",
                     prepare: () => DateTime.now().toSQL() })
  public dateCreate: DateTime;

  @hasOne(() => TypesIncapacity, {
    localKey: "codIncapacityType",
    foreignKey: "id",
  })
  public typeIncapacity: HasOne<typeof TypesIncapacity>;

}
