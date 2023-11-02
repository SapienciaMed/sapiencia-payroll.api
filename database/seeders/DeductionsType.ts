import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import DeductionsType from "App/Models/DeductionType";

export default class extends BaseSeeder {
  public async run() {
    await DeductionsType.createMany([
      { id: 1, name: "Aportes AFC", type: "Ciclica" },
      { id: 2, name: "Aportes Pensión Voluntaria", type: "Ciclica" },
      { id: 3, name: "Poliza de vida", type: "Ciclica" },
      { id: 4, name: "Poliza de salud", type: "Ciclica" },
      { id: 5, name: "Libranza caja de compensación", type: "Ciclica" },
      { id: 6, name: "Embargos", type: "Ciclica" },
      { id: 7, name: "Mayor valor pagado por salario", type: "Eventual" },
      { id: 8, name: "Otros descuentos", type: "Eventual" },
      { id: 9, name: "Menor valor descontado", type: "Eventual" },
      { id: 10, name: "Seguridad Social", type: "Automatico" },
      { id: 11, name: "Pensión", type: "Automatico" },
      { id: 12, name: "Impuesto sobre la renta", type: "Automatico" },
      { id: 13, name: "Fondo de solidaridad", type: "Automatico" },
      { id: 14, name: "Personas dependientes", type: "Automatico" },
    ]);
  }
}
