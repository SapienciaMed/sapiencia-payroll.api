import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "TCG_TIPOS_CARGOS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene las unidades");
      table.increments("TCG_CODIGO").primary().comment("llave primaria");
      table.string("TCG_NOMBRE", 100).comment("Nombre del tipo de cargo ");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
