import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "LIC_LICENCIAS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene el registro de las licencias");

      table
        .increments("LIC_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("LIC_CODEMP_EMPLEO")
        .unsigned().references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("codigo del empleo (FK EMP_EMPLEOS)");
      table
        .integer("LIC_CODTLC_TIPO_LICENCIA")
        .unsigned().references("TLC_CODIGO")
        .inTable("TLC_TIPOS_LICENCIAS")
        .unsigned()
        .nullable()
        .comment("codigo del tipo de licencia (FK TLC_TIPOS_LICENCIAS)");
      table
        .date("LIC_FECHA_INICIO")
        .notNullable()
        .comment("fecha de inicio de la licencia");
      table
        .date("LIC_FECHA_FIN")
        .notNullable()
        .comment("fecha de finalizacion de la licencia");
        table
        .string("LIC_NUMERO_RESOLUCION",50)
        .notNullable()
        .comment("número de resolución de la licencia");
      table
        .string("LIC_ESTADO", 20)
        .notNullable()
        .comment("estado de la licencia (Finalizado, En Curso)");
      table
        .string("LIC_OBSERVACIONES", 500)
        .nullable()
        .comment("Observaciones de la licencia");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
