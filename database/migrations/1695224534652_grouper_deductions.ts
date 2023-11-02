import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'DAG_DEDUCCIONES_AGRUPADOR'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Contine las deducciones asociadas al agrupador"
      );
      table
        .increments("DAG_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("DAG_CODAGR_AGRUPADOR")
        .unsigned()
        .references("AGR_CODIGO")
        .inTable("AGR_AGRUPADORES")
        .notNullable()
        .comment("Codigo del Agrupador (FK AGR)");

      table
        .integer("DAG_CODTDD_TIPO_DEDUCCION")
        .unsigned()
        .references("TDD_CODIGO")
        .inTable("TDD_TIPOS_DEDUCCIONES")
        .unsigned()
        .notNullable()
        .comment("Codigo del tipo de ingreso (FK TDD)");
      table
        .string("DAG_SIGNO", 1)
        .notNullable()
        .comment("Indicador de que si suma + o resta -");
    });
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
