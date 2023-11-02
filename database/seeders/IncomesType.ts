import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import IncomeType from "App/Models/IncomeType";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await IncomeType.createMany([
      {
        id: 1,
        name: "Salario",
        type: "Automatico",
      },
      {
        id: 2,
        name: "Vacaciones",
        type: "Automatico",
      },
      {
        id: 3,
        name: "Incapacidad",
        type: "Eventual",
      },
      {
        id: 4,
        name: "Licencia",
        type: "Eventual",
      },
      {
        id: 5,
        name: "Bonificaciones",
        type: "Automatico",
      },
      {
        id: 6,
        name: "Aporte de pension",
        type: "Automatico",
      },
      {
        id: 7,
        name: "Fondo solidaridad",
        type: "Automatico",
      },
      {
        id: 8,
        name: "Salud",
        type: "Automatico",
      },
      {
        id: 9,
        name: "Arl",
        type: "Automatico",
      },
      {
        id: 10,
        name: "Arl",
        type: "Aportes a fondo de pension obligatorios",
      },
      {
        id: 11,
        name: "Prima de navidad",
        type: "Automatico",
      },
      {
        id: 12,
        name: "Bonificación de servicio",
        type: "Automatico",
      },
      {
        id: 13,
        name: "Prima de servicio",
        type: "Automatico",
      },
      {
        id: 14,
        name: "Prima de Vacaciones",
        type: "Automatico",
      },
      {
        id: 15,
        name: "Bonificación de recreación",
        type: "Automatico",
      },
      {
        id: 16,
        name: "Intereses de cesantías",
        type: "Automatico",
      },
      {
        id: 17,
        name: "Aprovechamiento del tiempo libre",
        type: "Eventual",
      },
      {
        id: 18,
        name: "Apoyo estudiantil",
        type: "Eventual",
      },
    ]);
  }
}
