import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "RNG_RANGOS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que detalla valores por rangos agrupados por un indicador"
      );
      table
        .increments("RNG_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .string("RNG_AGRUPADOR", 50)
        .notNullable()
        .comment(
          "Nombre Indicador que agrupa para rastrear los elementos del rango"
        );
      table.integer("RNG_INICIO").notNullable().comment("rango inicial");
      table.integer("RNG_FIN").notNullable().comment("rango final");
      table
        .integer("RNG_VALOR")
        .notNullable()
        .comment("valor asociado al rango");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
