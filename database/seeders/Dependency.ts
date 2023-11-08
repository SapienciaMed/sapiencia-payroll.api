import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Dependence from "App/Models/Dependence";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Dependence.createMany([
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
