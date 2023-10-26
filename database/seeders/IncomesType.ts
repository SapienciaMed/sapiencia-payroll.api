import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import IncomeType from 'App/Models/IncomeType'

export default class extends BaseSeeder {

  public async run () {
    // Write your database queries inside the run method
    await IncomeType.createMany([
      {
        name: "Salario",
        type:"Automatico"
      },
      {
        name: "Vacaciones",
        type:"Automatico"
      },
      {
        name: "Incapacidad",
        type:"Eventual"
      },
      {
        name: "Licencia",
        type:"Eventual"
      },
      {
        name: "Bonificación de servicio",
        type: "Automatico",
      },
      {
        name: "Prima de servicio",
        type: "Automatico",
      },
      {
        name: "Bonificación de recreación",
        type: "Automatico",
      },
      {
        name: "Prima de Vacaciones",
        type: "Automatico",
      },
      {
        name: "Prima de navidad",
        type: "Automatico",
      },
      {
        name: "Intereses de cesantías",
        type: "Automatico",
      },
    ])
  }
}
