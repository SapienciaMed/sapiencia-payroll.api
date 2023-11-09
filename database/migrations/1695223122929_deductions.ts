import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "DED_DEDUCCIONES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que registra el detalle de las deducciones");

      table
        .increments("DED_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("DED_CODPPL_PLANILLA")
        .unsigned()
        .references("PPL_CODIGO")
        .inTable("PPL_PERIODOS_PLANILLA")
        .unsigned()
        .notNullable()
        .comment(
          "Contiene el historico de los resumenes de las ejecuciones de planilla"
        );
      table
        .integer("DED_CODEMP_EMPLEO")
        .unsigned()
        .references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("Codigo del empleo (FK EMP)");
      table
        .integer("DED_CODTDD_TIPO_DEDUCCION")
        .unsigned()
        .references("TDD_CODIGO")
        .inTable("TDD_TIPOS_DEDUCCIONES")
        .unsigned()
        .notNullable()
        .comment("Codigo del tipo de ingreso (FK TDD)");
      table
        .decimal("DED_VALOR", 14, 2)
        .notNullable()
        .comment("Valor de dinero");
      table
        .decimal("DED_VALOR_PATRONAL", 14, 2)
        .notNullable()
        .comment("Valor correspondiente a pagar de la parte patronal");
      table
        .integer("DED_TIEMPO")
        .nullable()
        .comment("Tiempo que corresponde al pago");
      table
        .string("DED_UNIDAD_TIEMPO",10)
        .nullable()
        .comment("Unidad de tiempo correspondiente (Horas / Dias)");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
