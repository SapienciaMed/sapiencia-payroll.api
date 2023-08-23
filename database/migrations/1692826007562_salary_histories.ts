import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "HSA_HISTORICOS_SALARIALES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que contiene los historicos salariales de trabajadores"
      );

      table
        .increments("HPA_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("HPA_CODEMP_EMPLEO")
        .references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("codigo del empleo (FK EMP_EMPLEOS)");
      table
        .integer("HPA_CODISA_INCREMENTO")
        .references("ISA_CODIGO")
        .inTable("ISA_INCREMENTOS_SALARIALES")
        .unsigned()
        .nullable()
        .comment("codigo del incremento (FK ISA_INCREMENTOS_SALARIALES)");
      table
        .decimal("HPA_SALARIO_ANTERIOR", 15, 2)
        .nullable()
        .comment("valor del aumento");
      table
        .decimal("HPA_SALARIO", 15, 2)
        .notNullable()
        .comment("Valor del salario anterior");
      table
        .timestamp("HPA_FECHA_VIGENCIA")
        .notNullable()
        .comment("Fecha desde cuando es vigente el salario");
      table
        .boolean("HPA_ES_VIGENTE")
        .notNullable()
        .comment("Indicado de que si es salario vigente");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
