import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Employment from "./Employment";
import FormsPeriod from "./FormsPeriod";
import ReserveType from "./ReserveType";

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
    columnName: "RSV_CODTRS_TIPO_RESERVA",
    serializeAs: "idTypeReserve",
  })
  public idTypeReserve: number;

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

  @hasMany(() => FormsPeriod, {
    localKey: "idTypePayroll",
    foreignKey: "id",
  })
  public formPeriod: HasMany<typeof FormsPeriod>;

  @hasMany(() => Employment, {
    localKey: "idEmployment",
    foreignKey: "id",
  })
  public employment: HasMany<typeof Employment>;

  @hasMany(() => ReserveType, {
    localKey: "idEmployment",
    foreignKey: "id",
  })
  public reserveType: HasMany<typeof ReserveType>;
}
