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
        .unsigned()
        .references("TRA_CODIGO")
        .inTable("TRA_TRABAJADORES")
        .comment("codigo del expediente (FK TRA_TRABAJADORES)");
      table
        .integer("EMP_CODDEP_DEPENDENCIA")
        .notNullable()
        .unsigned()
        .references("DEP_CODIGO")
        .inTable("DEP_DEPENDENCIAS")
        .comment("Codigo de la dependencia (FK DEP)");
      table
        .integer("EMP_CODCRG_CARGO")
        .notNullable()
        .unsigned()
        .references("CRG_CODIGO")
        .inTable("CRG_CARGOS")
        .comment("codigo del cargo (FK CRG_CARGOS)");
      table
        .string("EMP_CORREO_INSTITUCIONAL", 50)
        .notNullable()
        .comment("Correon institucional ");
      table
        .integer("EMP_CODTCO_TIPO_CONTRATO")
        .notNullable()
        .comment("Tipo de contrato de vinculacionn del empleado")
        .unsigned()
        .references("TCO_CODIGO")
        .inTable("TCO_TIPOS_CONTRATO");
      table
        .string("EMP_NUMERO_CONTRATO", 10)
        .notNullable()
        .comment("Numero del contrato ");
      table
        .date("EMP_FECHA_INICIO")
        .notNullable()
        .comment("Fecha de inicio del contrato ");
      table
        .date("EMP_FECHA_FIN")
        .comment("Fecha de finalizacion del contrato ");
      table
        .string("EMP_OBLIGACIONES_ESPECIFICAS", 10000)
        .comment("Texto donde se definen las obligaciones de la contratacion");
      table
        .string("EMP_OBJECTO_CONTRACTUAL", 5000)
        .comment("Objeto contractual del empleo");
      table
        .string("EMP_ESTADO", 10)
        .notNullable()
        .comment("Estado del empleos");
      table
        .integer("EMP_CODTMR_MOTIVO_RETIRO")
        .unsigned()
        .references("TMR_CODIGO")
        .inTable("TMR_TIPOS_MOTIVOS_RETIRO")
        .comment("codigo del motivo de retiro (FK TMR_TIPOS_MOTIVOS_RETIRO)");
      table
        .date("EMP_FECHA_RETIRO")
        .comment("Fecha en que se retiro el empleado");
      table
        .boolean("EMP_LIQUIDACION_PAGADA")
        .comment(
          "Indicador de que a la persona ya se le calculo y autorizo la liquidacion"
        );
      table
        .decimal("EMP_TOTAL_VALUE", 15, 2)
        .notNullable()
        .comment(
          "Valor total que recibira empleado por prestacion de servicio"
        );
      // table
      // .string("EMP_OBSERVACION")
      // .comment("observacion retiro");
      table
        .string("EMP_USUARIO_MODIFICO", 10)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );
      table
        .dateTime("EMP_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");
      table
        .string("EMP_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .dateTime("EMP_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
