import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import LicenceType from 'App/Models/LicenceType';

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await LicenceType.createMany([
      {
       name:"Licencia de maternidad",
       numberDays:126,
       daysType:"Calendario"
      },
      {
        name:"Licencia de paternidad",
        numberDays: 30,
        daysType:"Calendario"
      },
      {
        name:"Licencia de luto",
        numberDays: 5,
        daysType:"Habil"
      },
      {
        name:"Licencia por calamidad doméstica",
        numberDays: 3,
        daysType:"Habil"
      },
      {
        name:"permiso no remunerado",
        daysType:"Habil"
      },
      {
        name:"permiso remunerado",
        daysType:"Habil"
      },
    ]);
  }
}
