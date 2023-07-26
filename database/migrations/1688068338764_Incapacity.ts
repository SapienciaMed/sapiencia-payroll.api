import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "INC_INCAPACIDADES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        " Almacena el registro de las incapacides de los colaborares "
      );

      table.increments("INC_CODIGO").primary().comment("llave primaria");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
