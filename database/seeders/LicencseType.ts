import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import LicenceType from 'App/Models/LicenceType';

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method

    await LicenceType.createMany([
      {
        name:"Licencia de maternidad prenatal",
        numberDays: 98 
      },
      {
       name:"Licencia de maternidad postnatal",
       numberDays:56
      },
      {
        name:"Licencia de paternidad",
        numberDays: 8
      },
      {
        name:"Licencia de luto",
        numberDays: 5
      },
      {
        name:"Licencia por calamida domestica",
        numberDays: 3
      },
      {
        name:"permiso no remunerado",
      },
      {
        name:"permiso remunerado",
      },
    ]);
  }
}
