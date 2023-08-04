import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "TPL_TIPOS_PLANILLA";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene los tipos de planilla de pago");
      table
        .increments("TPL_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .string("TPL_NOMBRE", 20)
        .notNullable()
        .comment("Nombre del tipo de planilla");
      table
        .string("TPL_FRECUENCIA", 10)
        .notNullable()
        .comment(
          "Frecuencia de la planilla (Quincenal, Mensual, Anual, Especial)"
        );
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
