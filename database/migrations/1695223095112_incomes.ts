import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "ING_INGRESOS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que registra el detalle de los ingresos recibidos por colaborador"
      );

      table
        .increments("ING_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("ING_CODPPL_PLANILLA")
        .unsigned()
        .references("PPL_CODIGO")
        .inTable("PPL_PERIODOS_PLANILLA")
        .unsigned()
        .notNullable()
        .comment(
          "Contiene el historico de los resumenes de las ejecuciones de planilla"
        );
      table
        .integer("ING_CODEMP_EMPLEO")
        .unsigned()
        .references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("Codigo del empleo (FK EMP)");
      table
        .integer("ING_CODTIG_TIPO_INGRESO")
        .unsigned()
        .references("TIG_CODIGO")
        .inTable("TIG_TIPOS_INGRESO")
        .unsigned()
        .notNullable()
        .comment("Codigo del tipo de ingreso (FK TIG)");
      table
        .decimal("ING_VALOR", 14, 2)
        .notNullable()
        .comment("Valor de dinero");
      table
        .integer("ING_TIEMPO")
        .nullable()
        .comment("Tiempo que corresponde al pago");
      table
        .string("ING_UNIDAD_TIEMPO",10)
        .nullable()
        .comment("Unidad de tiempo correspondiente (Horas / Dias)");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
