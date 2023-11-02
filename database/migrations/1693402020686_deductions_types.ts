import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "TDD_TIPOS_DEDUCCIONES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que define los tipos de deducciones que se aplican en planilla"
      );
      table
        .increments("TDD_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .string("TDD_NOMBRE", 100)
        .notNullable()
        .comment("Descripcion de la deduccion");
      table
        .string("TDD_TIPO", 15)
        .nullable()
        .comment(
          "Indicador de tipo de procesamiento (Ciclica, Eventual, Automatica)"
        );

      table
        .string("TDD_CUENTA_CONTABLE", 50)
        .nullable()
        .comment("Numero de cuenta contable");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
