import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "DVA_DIAS_VACACIONES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Registra los dias de vacaciones disfrutados ya sea en tiempo o pago"
      );

      table
        .increments("DVA_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("DVA_CODVAC_VACACION")
        .unsigned().references("VAC_CODIGO")
        .inTable("VAC_VACACIONES").unsigned()
        .comment("codigo del periodo de vacaciones (FK VAC_VACIONES)");
      table
        .date("DVA_FECHA_DESDE")
        .notNullable()
        .comment("Fecha de inicio del disfrute");
      table
        .date("DVA_FECHA_HASTA")
        .nullable()
        .comment("Fecha de inicio del disfrute");
      table
        .integer("DVA_DIAS")
        .notNullable()
        .comment("Numero de dias disfrutados");
      table
        .boolean("DVA_PAGADAS")
        .notNullable()
        .comment(
          "Indicador de que el disfrute de vacacion es pago o en tiempo"
        );
      table
        .integer("DVA_CODPPL_PLANILLA")
        .unsigned().references("VAC_CODIGO")
        .inTable("VAC_VACACIONES")
        .nullable()
        .comment("codigo del periodo de vacaciones (FK PPL_PERIODOS_PLANILLA)");
      table
        .string("DVA_OBSERVACIONES", 500)
        .notNullable()
        .comment("Observaciones sobre el periodo de vacaciones");
      table
        .string("DVA_TIPO_REINTEGRO", 15)
        .nullable()
        .comment(
          "Indica si las vacaciones han sido reintegradas (General, Incapacaidad o null)"
        )
        .defaultTo(null);
      table
        .string("DVA_USUARIO_MODIFICO", 15)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );
      table
        .dateTime("DVA_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");
      table
        .string("DVA_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .dateTime("DVA_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
