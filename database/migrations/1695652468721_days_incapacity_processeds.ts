import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "DIP_DIAS_INCAPACIDAD_PROCESADOS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("lleva el registro de los dias incapacidad procesados");

      table
        .increments("DIP_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("DIP_CODINC_INCAPACIDAD")
        .unsigned()
        .references("INC_CODIGO")
        .inTable("INC_INCAPACIDADES")
        .unsigned()
        .comment("codigo de la incapacidad (FK INC_INCAPACIDADES)");
      table
        .integer("DIP_CODPPL_PLANILLA")
        .unsigned()
        .references("PPL_CODIGO")
        .inTable("PPL_PERIODOS_PLANILLA")
        .unsigned()
        .nullable()
        .comment("codigo del periodo de planilla(FK PPL_PERIODOS_PLANILLA)");
      table
        .date("DIP_FECHA_INICIO")
        .notNullable()
        .comment("Fecha de inicio de los dias procesados");
      table
        .date("DIP_FECHA_FIN")
        .notNullable()
        .comment("Fecha de finalizacion de los dias procesados");
      table.integer("DIP_DIAS").notNullable().comment("numero de dias");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
