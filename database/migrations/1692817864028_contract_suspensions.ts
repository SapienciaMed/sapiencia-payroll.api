import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "SCO_SUSPENCION_CONTRATOS";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que detalla las acciones de suspencioanes de contratos"
      );

      table
        .increments("SCO_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("SCO_CODEMP_EMPLEO")
        .unsigned().references("EMP_CODIGO")
        .inTable("EMP_EMPLEOS")
        .unsigned()
        .notNullable()
        .comment("codigo del empleo (FK EMP_EMPLEOS)");
      table
        .date("SCO_FECHA_INICIO")
        .notNullable()
        .comment("fecha de inicio de la suspencion");
      table
        .date("SCO_FECHA_FIN")
        .notNullable()
        .comment("fecha de finalizacion de la suspencion");
      table
        .boolean("SCO_AJUSTA_FECHA_FIN")
        .notNullable()
        .comment(
          "Indicador de que si la fecha fin de contarto se vera afectado por la suspencion"
        );
      table
        .date("SCO_NUEVA_FECHA_FIN")
        .nullable()
        .comment("Nueva fecha de finalizacion de contrato");
      table
        .string("SCO_OBSERVACIONES", 500)
        .nullable()
        .comment("Observaciones del aumento de salario");
      table
        .string("SCO_USUARIO_MODIFICO", 15)
        .comment(
          "Numero del documento del ultimo usuario que hizo una modificacion"
        );
      table
        .dateTime("SCO_FECHA_MODIFICO")
        .comment("Fecha y hora de la ultima modificacion");
      table
        .string("SCO_USUARIO_CREO", 15)
        .notNullable()
        .comment("Numero del documento del usuario que creo el registro");
      table
        .dateTime("SCO_FECHA_CREO")
        .notNullable()
        .comment("Fecha y hora de creacion del registro");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
