import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import ReserveType from "App/Models/ReserveType";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await ReserveType.createMany([
      { id: 1, name: "Bonificación de servicio" },
      { id: 2, name: "Prima de servicio" },
      { id: 3, name: "Bonificación de recreación" },
      { id: 4, name: "Vacaciones" },
      { id: 5, name: "Prima de vacaciones" },
      { id: 6, name: "Prima de navidad" },
      { id: 7, name: "Cesantías" },
      { id: 8, name: "Intereses de cesantías" },
    ]);
  }
}
