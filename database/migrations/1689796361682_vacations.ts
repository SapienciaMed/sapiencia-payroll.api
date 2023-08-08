import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "VAC_VACACIONES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que almacena los periodos de vacaciones de los trabajadores "
      );

      table
        .increments("VAC_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("VAC_CODEMP_EMPLEO")
        .references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS").unsigned()
        .comment("codigo del empleo (FK EMP_EMPLEOS)");
      table
        .integer("VAC_PERIODO")
        .notNullable()
        .comment("Referencia del periodo de vacaciones del empleado ");
      table
        .timestamp("VAC_FECHA_DESDE")
        .notNullable()
        .comment("Fecha de inicio del periodo");
      table
        .timestamp("VAC_FECHA_HASTA")
        .notNullable()
        .comment("Fecha de finalizacion del periodo");
      table
        .integer("VAC_PERIODO_ANTERIOR")
        .notNullable()
        .comment("Dias que quedaron disponibles en el periodo anterior");
      table
        .integer("VAC_DIAS")
        .notNullable()
        .comment("Dias de vacaciones ganados");
      table
        .integer("VAC_DISFRUTADOS")
        .notNullable()
        .comment("Segundo apellido del colaborador");
      table
        .integer("VAC_DIAS_REINTEGRADOS")
        .notNullable()
        .comment("Numero de dias reintegrados")
        .defaultTo(0);
      table
        .integer("VAC_DISPONIBLES")
        .notNullable()
        .comment("Dias disponibles de vacaciones");
      table
        .boolean("VAC_PERIODO_CERRADO")
        .notNullable()
        .comment("Indicador de que si el periodo se encuentra cerrado");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
