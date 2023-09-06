import { DateTime } from "luxon";
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm";
import Env from "@ioc:Adonis/Core/Env";
import Charge from "./Charge";

export default class SalaryIncrement extends BaseModel {
  public static table = "ISA_INCREMENTOS_SALARIALES";

  @column({ isPrimary: true, columnName: "ISA_CODIGO", serializeAs: "id" })
  public id: number;

  @column({ columnName: "ISA_CODCRG_CARGO", serializeAs: "codCharge" })
  public codCharge: number;

  @column.dateTime({
    autoCreate: false,
    columnName: "ISA_FECHA_EFECTIVA",
    serializeAs: "effectiveDate",
  })
  public effectiveDate: DateTime;

  @column({
    columnName: "ISA_ACTA_APROBACION",
    serializeAs: "numberActApproval",
  })
  public numberActApproval: string;

  @column({
    columnName: "ISA_ES_PORCENTUAL",
    serializeAs: "porcentualIncrement",
    prepare: (val) => (String(val) === "true" ? 1 : 0),
    serialize: (val) => Boolean(val),
  })
  public porcentualIncrement: boolean;

  @column({ columnName: "ISA_VALOR", serializeAs: "incrementValue" })
  public incrementValue: number;

  @column({ columnName: "ISA_SALARIO_ANTERIOR", serializeAs: "previousSalary" })
  public previousSalary: number;

  @column({ columnName: "ISA_NUEVO_SALARIO", serializeAs: "newSalary" })
  public newSalary: number;

  @column({ columnName: "ISA_OBSERVACIONES", serializeAs: "observation" })
  public observation: string;

  @column({
    columnName: "ISA_USUARIO_MODIFICO",
    serializeAs: "userModified",
  })
  public userModified: string;

  @column.dateTime({
    autoUpdate: true,
    columnName: "ISA_FECHA_MODIFICO",
    serializeAs: "dateModified",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateModified: DateTime;

  @column({
    columnName: "ISA_USUARIO_CREO",
    serializeAs: "userCreate",
  })
  public userCreate: string | undefined = Env.get("USER_ID");

  @column.dateTime({
    autoCreate: true,
    columnName: "ISA_FECHA_CREO",
    serializeAs: "dateCreate",
    prepare: () => DateTime.now().toSQL(),
  })
  public dateCreate: DateTime;

  @hasOne(() => Charge, {
    localKey: "codCharge",
    foreignKey: "id",
  })
  public charge: HasOne<typeof Charge>;
}
