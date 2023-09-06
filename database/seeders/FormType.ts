import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import FormsType from "App/Models/FormsType";

export default class extends BaseSeeder {
  public async run() {
    await FormsType.createMany([
      {
        name: "Quincenal",
        special: false,
        frecuencyPaid: "Quincenal",
      },
      {
        name: "Mensual",
        special: false,
        frecuencyPaid: "Mensual",
      },
      {
        name: "Prima",
        special: false,
        frecuencyPaid: "Especial",
      },
      {
        name: "Prima navidad",
        special: false,
        frecuencyPaid: "Anual",
      },
      {
        name: "Prima de servicios",
        special: false,
        frecuencyPaid: "Anual",
      },
      {
        name: "Bonificación",
        special: true,
        frecuencyPaid: "Anual",
      },
      {
        name: "Liquidación",
        special: true,
        frecuencyPaid:"Especial"
      },
      {
        name: "Vacaciones",
        special:false,
        frecuencyPaid:"Anual"
      },
      {
        name:"Cesantias",
        special:false,
        frecuencyPaid:"Mensual"
      }
    ]);
  }
}
