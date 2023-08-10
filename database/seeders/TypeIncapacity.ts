import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import TypesIncapacity from "App/Models/TypesIncapacity";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await TypesIncapacity.createMany([
      {
        name: "Enfermedad comun",
      },
      {
        name: "Enfermedad laboral",
      },
    ]);
  }
}
