import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "DDM_DEDUCCIONES_MANUALES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que contiene el registro de las deducciones manuales tanto como ciclicas y eventuales"
      );

      table
        .increments("DDM_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("DDM_CODEMP_EMPLEO")
        .references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("codigo del empleo (FK EMP_EMPLEOS)");
      table
        .boolean("DDM_ES_CICLICA")
        .notNullable()
        .comment("Indicado de que si la deduccion es ciclica o no");
        table
        .boolean("DDM_APLICA_EXTRAORDINARIA")
        .nullable()
        .comment("Indicado de que si la deduccion se aplica a extraordinaria");
      table
        .integer("DDM_CODTDD_TIPO_DEDUCCION")
        .references("TDD_CODIGO")
        .inTable("TDD_TIPOS_DEDUCCIONES")
        .unsigned()
        .nullable()
        .comment("codigo del tipo de deduccion (FK TDD_TIPOS_DEDUCCIONES)");
      table
        .boolean("DDM_ES_PORCENTUAL")
        .notNullable()
        .comment("Indicador de si el valor es porcentual o se define el valor");
      table
        .decimal("DDM_VALOR", 15, 2)
        .notNullable()
        .comment("valor de la deduccion / cuota");
      table
        .integer("DDM_NUMERO_CUOTAS")
        .nullable()
        .comment("Numero de cuotas que se deben aplicar para las ciclicas");
      table
        .decimal("DDM_MONTO_TOTAL", 15, 2)
        .nullable()
        .comment("valor de la deduccion / cuota");

      table
        .integer("DDM_CODPPL")
        .references("PPL_CODIGO")
        .inTable("PPL_PERIODOS_PLANILLA")
        .unsigned()
        .nullable()
        .comment("codigo del periodo de planilla (FK PPL_PERIODOS_PLANILLA)");
      table
        .string("DDM_ESTADO", 20)
        .notNullable()
        .comment("Estado de la deduccion (Vigente, Finalizada)");
      table
        .string("DDM_OBSERVACION", 500)
        .nullable()
        .comment("Observaciones de la deduccion");
      table
        .string("DDM_USUARIO_MODIFICO", 15)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );
      table
        .dateTime("DDM_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");
      table
        .string("DDM_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .dateTime("DDM_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
