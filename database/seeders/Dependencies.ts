import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Dependencies from "App/Models/Dependence";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Dependencies.createMany([
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
