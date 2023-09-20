import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "RSV_RESERVAS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que registra el detalle de los ingresos recibidos por colaborador"
      );

      table
        .increments("RSV_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("RSV_CODPPL_PLANILLA")
        .unsigned()
        .references("PPL_CODIGO")
        .inTable("PPL_PERIODOS_PLANILLA")
        .unsigned()
        .notNullable()
        .comment(
          "Contiene el historico de los resumenes de las ejecuciones de planilla"
        );
      table
        .integer("RSV_CODEMP_EMPLEO")
        .unsigned()
        .references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("Codigo del empleo (FK EMP)");
      table
        .integer("RSV_CODTDD_TIPO_DEDUCCION")
        .unsigned()
        .references("TRS_CODIGO")
        .inTable("TRS_TIPOS_RESERVAS")
        .unsigned()
        .notNullable()
        .comment("Codigo del tipo de ingreso (FK TIG)");
      table
        .decimal("RSV_VALOR", 10, 2)
        .notNullable()
        .comment("Valor de dinero");
      table
        .integer("RSV_TIEMPO")
        .nullable()
        .comment("Tiempo que corresponde al pago");
      table
        .string("RSV_UNIDAD_TIEMPO",10)
        .nullable()
        .comment("Unidad de tiempo correspondiente (Horas / Dias)");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
