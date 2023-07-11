import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Charge from 'App/Models/Charge'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Charge.createMany([{
      name:"Director General",
      state:"Activo",
      baseSalary:0,
      codChargeType:1,
      codUnit:1,
      userCreate:"test",
    },
    {
      name:"Subdirector Administrativo, Financiero y de Apoyo a la gestión",
      state:"Activo",
      baseSalary:0,
      codChargeType:1,
      codUnit:1,
      userCreate:"test",
    },
    {
      name:"Subdirector de Gestión de Educación Postsecundaria",
      state:"Activo",
      baseSalary:0,
      codChargeType:1,
      codUnit:1,
      userCreate:"test",
    },
    {
      name:"Jefe de Oficina Asesora Jurídica",
      state:"Activo",
      baseSalary:0,
      codChargeType:1,
      codUnit:1,
      userCreate:"test",
    },
    {
      name:"Jefe de Control Interno",
      state:"Activo",
      baseSalary:0,
      codChargeType:1,
      codUnit:1,
      userCreate:"test",
    },
    {
      name:"Director Técnico de Fondos",
      state:"Activo",
      baseSalary:0,
      codChargeType:1,
      codUnit:1,
      userCreate:"test",
    },
    {
      name:"Profesional Universitario",
      state:"Activo",
      baseSalary:0,
      codChargeType:1,
      codUnit:1,
      userCreate:"test",
    },
    {
      name:"Secretaria",
      state:"Activo",
      baseSalary:0,
      codChargeType:1,
      codUnit:1,
      userCreate:"test"
    },
  ])
  }
}
