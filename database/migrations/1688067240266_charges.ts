import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "CRG_CARGOS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment("Tabla que almacena los cargos labores				");
      table.increments("CRG_CODIGO").primary().comment("llave primaria");
      table
        .string("CRG_NOMBRE", 100)
        .notNullable()
        .comment("nombre del cargo ");
      // table
      //   .integer("CRG_CODUNI_UNIDAD")
      //   .notNullable()
      //   .unsigned()
      //   .references("UNI_CODIGO")
      //   .inTable("UNI_UNIDADES")
      //   .comment("codigo de la unidad (FK UNI_UNIDADES)"); // Pendiente de revisar
      table
        .integer("CRG_CODTCO_TIPO_CONTRATO")
        .notNullable()
        .unsigned()
        .references("TCO_CODIGO")
        .inTable("TCO_TIPOS_CONTRATO")
        .comment("codigo del tipo de contrato (FK TCO_TIPOS_CONTRATO)"); // Pendiente de revisar
      table
        .integer("CRG_CODTCG_TIPO_CARGO")
        .notNullable()
        .unsigned()
        .references("TCG_CODIGO")
        .inTable("TCG_TIPOS_CARGOS")
        .comment("codigo del tipo de cargo (FK TCG_TIPOS_CARGOS)");
      table
        .string("CRG_OBSERVACIONES", 5000)
        .notNullable()
        .comment("decripcion de las funciones del cargo");
      table
        .decimal("CRG_SALARIO_BASE", 10, 2)
        .notNullable()
        .comment("salario base del cargo ");
      table
        .boolean("CRG_ACTIVO")
        .notNullable()
        .comment("Indicador de que si el cargo esta activo");
      table
        .string("CRG_USUARIO_MODIFICO", 15)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );
      table
        .dateTime("CRG_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");
      table
        .string("CRG_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .dateTime("CRG_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
