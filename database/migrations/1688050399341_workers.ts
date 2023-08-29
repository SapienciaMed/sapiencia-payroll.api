import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "TRA_TRABAJADORES";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que contine la informacion pesonal de los colaboradores"
      );

      table.increments("TRA_CODIGO").primary().comment("Llave primaria");
      table
        .string("TRA_TIPO_DOCUMENTO", 4)
        .notNullable()
        .comment("Tipo de documento del usuario (Listados Genericos)");
      table
        .string("TRA_NUMERO_DOCUMENTO", 15)
        .notNullable()
        .unique()
        .comment("Numero de documento de identidad");
      table
        .string("TRA_PRIMER_NOMBRE", 50)
        .notNullable()
        .comment("Primer nombre del colaborador");
      table
        .string("TRA_SEGUNDO_NOMBRE", 50)
        .comment("Segundo nombre del colarador");
      table
        .string("TRA_PRIMER_APELLIDO", 50)
        .notNullable()
        .comment("Primer apellido del colaborador ");
      table
        .string("TRA_SEGUNDO_APELLIDO", 50)
        .comment("Segundo apellido del colaborador");
      table
        .string("TRA_GENERO", 10)
        .notNullable()
        .comment("Genero (Listados Genericos)");
      table
        .string("TRA_TIPO_SANGRE", 10)
        .notNullable()
        .comment("Tipo de sangre");
      table
        .timestamp("TRA_FECHA_NACIMIENTO")
        .notNullable()
        .comment("Fecha de nacimiento");
      table
        .string("TRA_NACIONALIDAD", 10)
        .notNullable()
        .comment("Nacionalidad del colaborador (Listados Genericos)");
      table
        .string("TRA_CORREO_ELECTRONICO", 50)
        .comment("Correo electronico personal");
      table
        .string("TRA_NUMERO_CONTACTO", 10)
        .notNullable()
        .comment("numero de contacto personal");
      table
        .string("TRA_DEPARTAMENTO", 10)
        .notNullable()
        .comment("Codigo del Departamento donde reside (Listados Genericos)");
      table
        .string("TRA_MUNICIPIO", 10)
        .notNullable()
        .comment("Codigo del Municipio donde reside (Listados Genericos)");
      table
        .string("TRA_BARRIO", 100)
        .notNullable()
        .comment("Barrio donde reside");
      table
        .string("TRA_DIRECCION", 100)
        .notNullable()
        .comment("Direccion de residencia");
      table
        .string("TRA_ESTRATO_SOCIOECONOMICO", 2)
        .comment("Estrato socioeconomico (Listados Genericos)");
      table.string("TRA_EPS", 10).comment("EPS afiliado (Listados Genericos)");
      table
        .string("TRA_FONDO_CESANTIAS", 10)
        .comment("Fondo de cesantias (Listados Genericos)");
      table.string("TRA_ARL", 10).comment("Arl (Listados Genericos)");
      table
        .string("TRA_FONDO_PENSION", 10)
        .comment("Fondo de pension (Listados Genericos)");
      table
        .string("TRA_NIVEL_RIESGO", 10)
        .comment("Nivel de riesgo (Listados Genericos)");
      table
        .string("TRA_TIPO_VIVIENDA", 10)
        .comment("Tipo de vivienda (Listados Genericos)");
      table
        .string("TRA_BANCO", 50)
        .comment("Codigo del Banco (Listados Genericos)");
      table
        .string("TRA_TIPO_CUENTA_BANCARIA", 10)
        .comment("Tipo de cuenta Bancaria (Listados Genericos)");
      table
        .string("TRA_CUENTA_BANCARIA", 50)
        .comment("Numero de la cuenta bancaria");
      table
        .string("TRA_USUARIO_MODIFICO", 15)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );
      table
        .timestamp("TRA_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");
      table
        .string("TRA_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .timestamp("TRA_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
