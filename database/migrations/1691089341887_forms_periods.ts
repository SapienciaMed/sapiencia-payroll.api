import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "PPL_PERIODOS_PLANILLA";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que contiene los periodos de planilla de pago de los colaboradores"
      );

      table
        .increments("PPL_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("PPL_CODTPL_TIPO_PLANILLA")
        .unsigned().references("TPL_CODIGO")
        .inTable("TPL_TIPOS_PLANILLA").unsigned()
        .comment("codigo del tipo de planilla (FK TPL_TIPOS_PLANILLA)");
      table
        .string("PPL_ESTADO", 10)
        .notNullable()
        .comment("Referencia del estado de la planilla");
      table
        .date("PPL_FECHA_INICIO")
        .notNullable()
        .comment("Fecha de inicio del periodo de planilla");
      table
        .date("PPL_FECHA_FIN")
        .notNullable()
        .comment("Fecha de finalizacion del periodo de planilla");
      table
        .date("PPL_FECHA_CORTE")
        .notNullable()
        .comment("fecha de corte para trabajar la planilla");
      table.date("PPL_FECHA_PAGO").notNullable().comment("fecha de pago");
      table
        .integer("PPL_MES")
        .notNullable()
        .comment("Mes al que corresponde la planilla");
      table
        .integer("PPL_ANIO")
        .notNullable()
        .comment("Año al que corresponde la planilla");
        table
        .string("PPL_OBSERVACIONES", 500)
        .notNullable()
        .comment("Observaciones de la planilla");
      table
        .string("PPL_USUARIO_MODIFICO", 15)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );
      table
        .dateTime("PPL_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");
      table
        .string("PPL_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .dateTime("PPL_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
