import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "TIN_TIPOS_INCAPACIDAD";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que almacena los tipos de incapacidades de los trabajadores"
      );

      table
        .increments("TIN_CODIGO")
        .primary()
        .unique()
        .comment("Llave primaria");

      table
        .string("TIN_NOMBRE", 100)
        .notNullable()
        .comment("Nombre del tipo de incapacidad");

      table
        .string("TIN_AGRUPADOR_RANGO", 50)
        .comment("Agrupador que busca el rango de la tabla RNG");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
