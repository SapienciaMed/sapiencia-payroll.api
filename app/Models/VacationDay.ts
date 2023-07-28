import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Env from "@ioc:Adonis/Core/Env";

export default class VacationDay extends BaseModel {
  public static table = "DVA_DIAS_VACACIONES";
  
  @column({ isPrimary: true, columnName: "DVA_CODIGO", serializeAs: "id", })
  public id: number;

  @column({ columnName: "DVA_CODVAC_VACACION", serializeAs: "codVacation" })
  public codVacation: number;
  
  @column.dateTime({ autoCreate: false,columnName: "DVA_FECHA_DESDE", serializeAs: "dateFrom"})
  public dateFrom: DateTime;

  @column.dateTime({ autoCreate: false,columnName: "DVA_FECHA_HASTA", serializeAs: "dateUntil"})
  public dateUntil: DateTime;

  @column({ columnName: "DVA_DIAS", serializeAs: "enjoyedDays" })
  public enjoyedDays: number;

  @column({ columnName: "DVA_PAGADAS", serializeAs: "paid" })
  public paid: boolean;

  @column({ columnName: "DVA_CODPPL_PLANILLA", serializeAs: "codForm" })
  public codForm: number;


  @column({
    columnName: "DVA_USUARIO_CREO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "DVA_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateModified: DateTime;

  @column({
    columnName: "DVA_FECHA_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string | undefined = Env.get("USER_ID");

  @column.dateTime({
    autoCreate: true,
    columnName: "DVA_USUARIO_CREO",
    serializeAs: "dateCreate",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateCreate: DateTime;
  // @hasOne(() => Employment, {
  //   localKey: "codEmployment",
  //   foreignKey: "id",
  // })
  // public typeCharge: HasOne<typeof Employment>;

}
