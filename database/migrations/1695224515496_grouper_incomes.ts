import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "IAG_INGRESOS_AGRUPADOR";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Contine los ingresos asociados al agrupador"
      );
      table
        .increments("IAG_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("IAG_CODAGR_AGRUPADOR")
        .unsigned()
        .references("AGR_CODIGO")
        .inTable("AGR_AGRUPADORES")
        .notNullable()
        .comment("Codigo del Agrupador (FK AGR)");

      table
        .integer("IAG_CODTIG_TIPO_INGRESO")
        .unsigned()
        .references("TIG_CODIGO")
        .inTable("TIG_TIPOS_INGRESO")
        .unsigned()
        .notNullable()
        .comment("Codigo del tipo de ingreso (FK TIG)");
      table
        .string("IAG_SIGNO", 1)
        .notNullable()
        .comment("Indicador de que si suma + o resta -");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
