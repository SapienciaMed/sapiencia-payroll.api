import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "TLC_TIPOS_LICENCIAS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene los tipos de licencias");
      table
        .increments("TLC_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .string("TLC_NOMBRE", 100)
        .notNullable()
        .comment("Nombre del tipo de licencia");
      table
        .integer("TLC_NUMERO_DIAS")
        .nullable()
        .comment("Numero de dias de las licencias");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
