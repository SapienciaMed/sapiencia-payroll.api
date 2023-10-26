import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import FormsType from 'App/Models/FormsType'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await FormsType.createMany([
      {
        name: "Quincenal",
        frecuencyPaid:"Quincenal",
        special:false
      },
      {
        name: "Mensual",
        frecuencyPaid:"Mensual",
        special:false
      },
      {
        name: "Liquidación",
        frecuencyPaid:"Especial",
        special:true
      },
      {
        name: "Prima de navidad",
        frecuencyPaid:"Anual",
        special:false
      },
      {
        name: "Prima de servicio",
        frecuencyPaid:"Anual",
        special:false
      },
      {
        name: "Vacaciones",
        frecuencyPaid:"Anual",
        special:false
      },
      {
        name: "Bonificación de servicio",
        frecuencyPaid:"Anual",
        special:false
      },
    ])
  }
}
