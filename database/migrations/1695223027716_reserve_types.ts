import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "TRS_TIPOS_RESERVAS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Contiene los tipos de ingresos");

      table
        .increments("TRS_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table.string("TRS_NOMBRE", 50).notNullable().comment("Nombre");

      table
        .string("TRD_CUENTA_CONTABLE", 50)
        .comment("Numero de cuenta contable");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
