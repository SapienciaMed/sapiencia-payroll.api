import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "UNI_UNIDADES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene las unidades");
      table.increments("UNI_CODIGO").primary().comment("llave primaria");
      table.string("UNI_NOMBRE", 100).notNullable().comment("Nombre del cargo");
      table
        .integer("UNI_CODUNI_SUPERIOR")
        .unsigned().references("UNI_CODIGO")
        .inTable("UNI_UNIDADES")
        .comment("codigo unidad superior (FK UNI_UNIDADES)");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
