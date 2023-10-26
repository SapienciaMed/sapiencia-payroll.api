import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import ReserveType from "App/Models/ReserveType";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await ReserveType.createMany([
      {
        name: "Bonificación de servicio",
      },
      {
        name: "Prima de servicio",
      },
      {
        name: "Bonificación de recreación",
      },
      {
        name: "Vacaciones",
      },
      {
        name: "Prima de vacaciones",
      },
      {
        name: "Prima de navidad",
      },
      {
        name: "Cesantías",
      },
      {
        name: "Intereses de cesantías",
      },
    ]);
  }
}
