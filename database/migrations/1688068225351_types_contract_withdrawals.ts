import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "TMR_TIPOS_MOTIVOS_RETIRO";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla de los tipos de motivos de retiro");
      table.increments("TMR_CODIGO").primary().comment("llave primaria");
      table
        .string("TMR_NOMBRE", 100)
        .notNullable()
        .comment("nombre del motivo de retiro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
