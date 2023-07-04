import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "EMP_EMPLEOS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que contiene los empleos de los colaboradores");
      table.increments("EMP_CODIGO").primary().comment("llave primaria");
      table
        .integer("EMP_CODTRA_TRABAJADOR")
        .notNullable()
        .references("TRA_CODIGO")
        .inTable("TRA_TRABAJADORES")
        .comment("codigo del expediente (FK TRA_TRABAJADORES)");
      table
        .integer("EMP_CODCRG_CARGO")
        .notNullable()
        .references("CRG_CODIGO")
        .inTable("CRG_CARGOS")
        .comment("codigo del cargo (FK CRG_CARGOS)");
      table
        .string("EMP_NUMERO_CONTRATO", 10)
        .notNullable()
        .comment("Numero del contrato ");

      table
        .timestamp("EMP_FECHA_INICIO")
        .notNullable()
        .comment("Fecha de inicio del contrato ");
      table
        .timestamp("EMP_FECHA_FIN")
        .comment("Fecha de finalizacion del contrato ");
      table
        .string("EMP_ESTADO", 10)
        .notNullable()
        .comment("Estado del empleos");
      table
        .integer("EMP_CODTMR_MOTIVO_RETIRO")
        .references("TMR_CODIGO")
        .inTable("TMR_TIPOS_MOTIVOS_RETIRO")
        .comment("codigo del motivo de retiro (FK TMR_TIPOS_MOTIVOS_RETIRO)");
      table
        .string("EMP_USUARIO_MODIFICO", 10)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );
      table
        .timestamp("EMP_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");
      table
        .string("EMP_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .timestamp("EMP_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
