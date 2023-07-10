import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "TCO_TIPOS_CONTRATO";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla de los tipos de contrato");
      table.increments("TCO_CODIGO").primary();
      table
        .string("TCO_NOMBRE", 100)
        .notNullable()
        .comment("nombre del tipo de contrato");
      table
        .boolean("TCO_ES_TEMPORAL")
        .notNullable()
        .comment("Indicador de que si es contrato es temporal o no ");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
