import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Unit from "App/Models/Unit";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Unit.createMany([
      {
        name: "Administrativa",
      },
      {
        name: "Operativa",
      },
      {
        name: "Financiera",
      },
    ]);
  }
}
