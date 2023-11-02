import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "HPL_HISTORICOS_PLANILLA";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Contiene el historico de los resumenes de las ejecuciones de planilla"
      );

      table
        .increments("HPL_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("HPL_CODPPL_PLANILLA")
        .unsigned()
        .references("PPL_CODIGO")
        .inTable("PPL_PERIODOS_PLANILLA")
        .unsigned()
        .notNullable()
        .comment(
          "Contiene el historico de los resumenes de las ejecuciones de planilla"
        );
      table
        .integer("HPL_CODEMP_EMPLEO")
        .unsigned()
        .references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("Codigo del empleo (FK EMP)");
      table
        .integer("HPL_DIAS_TRABAJADOS")
        .notNullable()
        .comment("Numero de dias laborados");
      table
        .decimal("HPL_SALARIO", 10, 2)
        .notNullable()
        .comment("Salario base durante la ejecucion");
      table
        .decimal("HPL_TOTAL_INGRESOS", 10, 2)
        .notNullable()
        .comment("Sumatoria de los ingresos");
      table
        .decimal("HPL_TOTAL_DEDUCCIONES", 10, 2)
        .notNullable()
        .comment("Sumatoria de las deducciones");
      table
        .decimal("HPL_TOTAL", 10, 2)
        .notNullable()
        .comment("Valor neto a pagar");
      table
        .string("HPL_ESTADO", 10)
        .notNullable()
        .comment("Estado en la generacion (Fallido, Exitoso)");
      table
        .string("HPL_OBSERVACIONES", 200)
        .nullable()
        .comment("Observaciones durante la generacion");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
