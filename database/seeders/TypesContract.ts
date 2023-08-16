import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TypesContract from 'App/Models/TypesContract';

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await TypesContract.createMany([
      {
        name:"Libre Nombramiento y Remoción",
        temporary: false
      },
      {
        name:"De Periodo",
        temporary: false
      },
      {
        name:"Carrera Administrativa",
        temporary: false
      },
      {
        name:"Prestación de servicios",
        temporary: true
      },
    ]);
  }

  }