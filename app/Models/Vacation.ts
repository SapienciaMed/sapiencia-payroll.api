import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Employment from './Employment';

export default class Vacation extends BaseModel {

  public static table = "VAC_VACACIONES";
  
  @column({ isPrimary: true, columnName: "VAC_CODIGO", serializeAs: "id", })
  public id: number;

  @column({ columnName: "VAC_CODEMP_EMPLEO", serializeAs: "codEmployment" })
  public codEmployment: string;

  @column({ columnName: "VAC_PERIODO", serializeAs: "period" })
  public period: string;
  
  @column.dateTime({ autoCreate: false,columnName: "VAC_FECHA_DESDE", serializeAs: "dateFrom"})
  public dateFrom: DateTime;

  @column.dateTime({ autoCreate: false,columnName: "  VAC_FECHA_HASTA", serializeAs: "dateUntil"})
  public dateUntil: DateTime;

  @column({ columnName: "VAC_PERIODO_ANTERIOR", serializeAs: "periodFormer" })
  public periodFormer: string;

  @column({ columnName: "VAC_DISFRUTADOS", serializeAs: "enjoyed" })
  public enjoyed: string;

  @column({ columnName: "VAC_DISPONIBLES", serializeAs: "available" })
  public available: string;

  @column({ columnName: "VAC_DIAS", serializeAs: "days" })
  public days: string;

  @column({ columnName: "VAC_PERIODO_CERRADO", serializeAs: "periodClosed" })
  public periodClosed: boolean;

  @hasOne(() => Employment, {
    localKey: "codEmployment",
    foreignKey: "id",
  })
  public typeCharge: HasOne<typeof Employment>;

}
