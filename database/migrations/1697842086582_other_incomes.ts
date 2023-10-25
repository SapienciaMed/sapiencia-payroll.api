import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "OIN_OTROS_INGRESOS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que ingresos manuales");

      table
        .increments("OIN_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();

      table
        .integer("OIN_CODEMP_EMPLEO")
        .unsigned()
        .references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("Codigo del empleo (FK EMP)");

      table
        .integer("OIN_CODTIG_TIPO_INGRESO")
        .unsigned()
        .references("TIG_CODIGO")
        .inTable("TIG_TIPOS_INGRESO")
        .unsigned()
        .notNullable()
        .comment("Codigo del tipo de ingreso (FK TIG)");

      table
        .integer("OIN_CODPPL_PLANILLA")
        .unsigned()
        .references("PPL_CODIGO")
        .inTable("PPL_PERIODOS_PLANILLA")
        .unsigned()
        .notNullable()
        .comment(
          "Contiene el historico de los resumenes de las ejecuciones de planilla"
        );

      table
        .decimal("OIN_VALOR", 15, 2)
        .notNullable()
        .comment("Total del valor certificado");

      table
        .string("OIN_ESTADO", 15)
        .notNullable()
        .comment("Estado del deduccible (Pendiente, Aplicado)");

      table
        .string("OIN_USUARIO_MODIFICO", 15)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );

      table
        .dateTime("OIN_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");

      table
        .string("OIN_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");

      table
        .dateTime("OIN_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
