import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'INC_INCAPACIDADES'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {

      table.comment("Tabla que almacena las incapacidades de los trabajadores");

      table
        .increments('INC_CODIGO')
        .primary()
        .unique()
        .comment('Llave primaria');

      table
        .integer("INC_CODTIN_TIPO_INCAPACIDAD")
        .unsigned().references("TIN_CODIGO")
        .inTable("TIN_TIPOS_INCAPACIDAD")
        .comment("Código del tipo de incapacidad (FK TIN_TIPOS_INCAPACIDAD)");

      table
        .integer("INC_CODEMP_EMPLEO")
        .unsigned().references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .comment("Código del empleo (FK EMP_EMPLEOS)");

      table
        .date("INC_FECHA_INICIO")
        .notNullable()
        .comment("Fecha de inicio de la incapacidad");

      table
        .date("INC_FECHA_FIN")
        .notNullable()
        .comment("Fecha de finalización de la incapacidad");

      table
        .string("INC_COMENTARIOS", 100)
        .nullable()
        .comment("Comentarios");

      table
        .boolean("INC_ES_PRORROGA")
        .notNullable()
        .defaultTo(false)
        .comment("Indicador de que si se hizo una modificación de la fecha fin");
        table
        .boolean("INC_COMPLETADA")
        .notNullable()
        .defaultTo(false)
        .comment("Indicador de que si se pago");

      table
        .string("INC_USUARIO_MODIFICO" , 15)
        .nullable()
        .comment("Número del documento del último usuario que hizo una modificación");

      table
        .dateTime("INC_FECHA_MODIFICO")
        .comment("Fecha y hora de la última modificación");

      table
        .string("INC_USUARIO_CREO", 15)
        .notNullable()
        .comment("Número del documento del usuario que creo el registro");

      table
        .dateTime("INC_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creación del registro");

    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
