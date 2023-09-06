import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import DeductionsType from "App/Models/DeductionsType";

export default class extends BaseSeeder {
  public async run() {
    await DeductionsType.createMany([
      {
        name: "Aportes AFC",
        cyclic: true,
      },
      {
        name: "Aportes Pensión Voluntaria",
        cyclic: true,
      },
      {
        name: "Poliza de vida",
        cyclic: true,
      },
      {
        name: "Poliza de salud",
        cyclic: true,
      },
      {
        name: "Libranza caja de compensación",
        cyclic: true,
      },
      {
        name: "Embargos",
        cyclic: true,
      },
      {
        name:"Mayor valor pagado por salario",
        cyclic: false,  
      },
      {
        name:"Otros descuentos",
        cyclic: false,
      },
      {
        name:"Menor valor descontado",
        cyclic: false,
      }
    ]);
  }
}
