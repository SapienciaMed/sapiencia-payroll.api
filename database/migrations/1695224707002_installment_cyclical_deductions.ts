import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "CDC_CUOTAS_DEDUCCION_CICLICA";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.comment(
        "Tabla que lleva el registro de las cuotas de la deducciones ciclicas generadas en las planillas"
      );

      table
        .increments("CDC_CODIGO")
        .primary()
        .comment("Llave primaria")
        .unique();
      table
        .integer("CDC_CODPPL_PLANILLA")
        .unsigned()
        .references("PPL_CODIGO")
        .inTable("PPL_PERIODOS_PLANILLA")
        .unsigned()
        .notNullable()
        .comment("Codigo del Tipo de Planilla (FK PPL)");
      table
        .integer("CDC_CODDDM_DEDUCCION")
        .unsigned()
        .references("DDM_CODIGO")
        .inTable("DDM_DEDUCCIONES_MANUALES")
        .unsigned()
        .notNullable()
        .comment("Codigo de la deduccion manual (FK DDM)");
      table
        .integer("CDC_NUMERO_CUOTA")
        .notNullable()
        .comment("numero de la cuota");
      table
        .decimal("CDC_VALOR_CUOTA", 10, 2)
        .notNullable()
        .comment("valor de la cuota generada");
      table
        .boolean("CDC_APLICADO")
        .notNullable()
        .comment("Indicador de que si la cuota se aplico en la planilla");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
