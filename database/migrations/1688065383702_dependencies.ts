import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "UNI_UNIDADES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene las unidades");
      table.increments("DEP_CODIGO").primary().comment("llave primaria");
      table.string("DEP_NOMBRE", 100).notNullable().comment("Nombre del cargo");
      table
        .integer("DEP_CODDEP_SUPERIOR")
        .unsigned()
        .references("DEP_CODIGO")
        .inTable("DEP_DEPENDENCIAS")
        .comment("codigo unidad superior (FK UNI_UNIDADES)");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
