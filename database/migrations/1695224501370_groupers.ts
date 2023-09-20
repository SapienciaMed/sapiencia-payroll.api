import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "AGR_AGRUPADORES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Contiene diferentes tipos de agrupadores que se utilizan para calculos"
      );

      table
        .increments("AGR_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .string("AGR_NOMBRE", 50)
        .notNullable()
        .comment("Nombre del agrupador");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
