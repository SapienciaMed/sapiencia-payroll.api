import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "FAM_FAMILIARES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene los familiares del colaborador");
      table.increments("FAM_CODIGO").primary().comment("llave primaria");
      table
        .integer("FAM_CODTRA_TRABAJADOR")
        .notNullable()
        .references("TRA_CODIGO")
        .inTable("TRA_TRABAJADORES")
        .comment("Codigo del expediente (FK TRA_TRABAJADORES)");
      table
        .string("FAM_NOMBRE", 150)
        .notNullable()
        .comment("Nombre completo del familiar");
      table
        .string("FAM_PARENTESCO", 10)
        .notNullable()
        .comment("Tipo de parentesco (Listados Genericos)");
      table
        .timestamp("FAM_FECHA_NACIMIENTO")
        .comment("Fecha de nacimiento del familiar");
      table.string("FAM_GENERO", 10).comment("Genero (Listados Genericos)");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
