import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import DeductionsType from "App/Models/DeductionsType";

export default class extends BaseSeeder {
  public async run() {
    await DeductionsType.createMany([
      {
        name: "Aportes AFC",
        type: "Ciclica",
      },
      {
        name: "Aportes Pensión Voluntaria",
        type: "Ciclica",
      },
      {
        name: "Poliza de vida",
        type: "Ciclica",
      },
      {
        name: "Poliza de salud",
        type: "Ciclica",
      },
      {
        name: "Libranza caja de compensación",
        type: "Ciclica",
      },
      {
        name: "Embargos",
        type: "Ciclica",
      },
      {
        name: "Mayor valor pagado por salario",
        type: "Eventual",
      },
      {
        name: "Otros descuentos",
        type: "Eventual",
      },
      {
        name: "Menor valor descontado",
        type: "Eventual",
      },
    ]);
  }
}
