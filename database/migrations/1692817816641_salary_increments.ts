import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "ISA_INCREMENTOS_SALARIALES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que detalla las acciones de los incrementos salariales aplicados a los cargos "
      );

      table
        .increments("ISA_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("ISA_CODCRG_CARGO")
        .unsigned().references("CRG_CODIGO")
        .inTable("CRG_CARGOS")
        .unsigned()
        .notNullable()
        .comment("codigo del cargo (FK CRG_CARGOS)");
      table
        .date("ISA_FECHA_EFECTIVA")
        .notNullable()
        .comment("Fecha desde cuando es efectivo el incremento ");
      table
        .string("ISA_ACTA_APROBACION", 100)
        .notNullable()
        .comment("Número del acta de aprobacion");
      table
        .boolean("ISA_ES_PORCENTUAL")
        .notNullable()
        .comment(
          "Indicador de que si el incremento es porcentual o definen el valor"
        );
      table
        .decimal("ISA_VALOR", 15, 2)
        .notNullable()
        .comment("valor del aumento");
      table
        .decimal("ISA_SALARIO_ANTERIOR", 15, 2)
        .notNullable()
        .comment("Valor del salario anterior");
      table
        .decimal("ISA_NUEVO_SALARIO", 15, 2)
        .notNullable()
        .comment("Valor del nuevo salario");
      table
        .string("ISA_OBSERVACIONES", 500)
        .nullable()
        .comment("Observaciones del aumento de salario");
      table
        .string("ISA_USUARIO_MODIFICO", 15)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );
      table
        .dateTime("ISA_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");
      table
        .string("ISA_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .dateTime("ISA_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
