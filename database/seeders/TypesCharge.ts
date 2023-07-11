import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TypesCharge from 'App/Models/TypesCharge';

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await TypesCharge.createMany([
      {
       name:"Administrativo"
      },
      {
        name:"Operativo"
      },
      {
        name:"Auxiliar"
      },
    ]);
  }
}
