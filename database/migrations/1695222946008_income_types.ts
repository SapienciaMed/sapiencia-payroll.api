import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'TIG_TIPOS_INGRESO'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Contiene los tipos de ingresos"
      );

      table
        .increments("TIG_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .string("TIG_NOMBRE",50)
        .notNullable()
        .comment("Nombre");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
