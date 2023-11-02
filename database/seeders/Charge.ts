import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Charge from "App/Models/Charge";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Charge.createMany([
      {
        name: "Director General",
        state: true,
        baseSalary: 0,
        codChargeType: 1,
        userCreate: "test",
        observations:"N/A"
      },
      {
        name: "Subdirector Administrativo, Financiero y de Apoyo a la gestión",
        state: true,
        baseSalary: 0,
        codChargeType: 1,
        userCreate: "test",
        observations:"N/A"
      },
      {
        name: "Subdirector de Gestión de Educación Postsecundaria",
        state: true,
        baseSalary: 0,
        codChargeType: 1,
        userCreate: "test",
        observations:"N/A"
      },
      {
        name: "Jefe de Oficina Asesora Jurídica",
        state: true,
        baseSalary: 0,
        codChargeType: 1,
        userCreate: "test",
        observations:"N/A"
      },
      {
        name: "Jefe de Control Interno",
        state: true,
        baseSalary: 0,
        codChargeType: 1,
        userCreate: "test",
        observations:"N/A"
      },
      {
        name: "Director Técnico de Fondos",
        state: true,
        baseSalary: 0,
        codChargeType: 1,
        userCreate: "test",
        observations:"N/A"
      },
      {
        name: "Profesional Universitario",
        state: true,
        baseSalary: 0,
        codChargeType: 1,
        userCreate: "test",
        observations:"N/A"
      },
      {
        name: "Secretaria",
        state: true,
        baseSalary: 0,
        codChargeType: 1,
        userCreate: "test",
        observations:"N/A"
      },
    ]);
  }
}
