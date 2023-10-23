import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "DER_DEDUCIBLES_RENTA";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que almacena los deduccibles externos de renta");

      table
        .increments("DER_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();

      table
        .integer("DER_AÑO")
        .notNullable()
        .comment("Año en que se aplica el deduccible");

      table
        .integer("DER_CODEMP_EMPLEO")
        .unsigned()
        .references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("Codigo del empleo (FK EMP)");

      table
        .string("DER_TIPO", 3)
        .notNullable()
        .comment("Tipo del deducible externos ISR (Listados Genericos)");

      table
        .decimal("DER_VALOR", 15, 2)
        .notNullable()
        .comment("Total del valor certificado");

      table
        .string("DER_ESTADO", 15)
        .notNullable()
        .comment("Estado del deduccible (Pendiente, Aplicado)");

      table
        .string("DER_USUARIO_MODIFICO", 15)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );

      table
        .dateTime("DER_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");

      table
        .string("DER_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");

      table
        .dateTime("DER_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
