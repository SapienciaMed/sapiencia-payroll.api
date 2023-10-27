import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import ReasonsForWithdrawal from "App/Models/ReasonsForWithdrawal";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await ReasonsForWithdrawal.createMany([
      {
        id: 1,
        name: "Terminación anticipada",
      },
      {
        id: 2,
        name: "Finalización de contrato",
      },
    ]);
  }
}
