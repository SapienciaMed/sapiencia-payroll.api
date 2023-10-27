import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Range from "App/Models/Range";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Range.createMany([
      {
        id: 1,
        grouper: "INCAPACIDAD_ENFERMEDAD_COMUN",
        start: 0,
        end: 2,
        value: 100,
      },
      {
        id: 2,
        grouper: "INCAPACIDAD_ENFERMEDAD_COMUN",
        start: 2,
        end: 180,
        value: 66.67,
      },
      {
        id: 3,
        grouper: "INCAPACIDAD_ENFERMEDAD_COMUN",
        start: 180,
        end: 540,
        value: 50,
      },
      {
        id: 4,
        grouper: "INCAPACIDAD_ENFERMEDAD_COMUN",
        start: 540,
        end: 999999,
        value: 0,
      },
      {
        id: 5,
        grouper: "INCAPACIDAD_ENFERMEDAD_LABORAL",
        start: 0,
        end: 999999,
        value: 100,
      },
      { id: 6, grouper: "TABLA_ISR", start: 0, end: 95, value: 0, value2: 0 },
      {
        id: 7,
        grouper: "TABLA_ISR",
        start: 95,
        end: 150,
        value: 19,
        value2: 0,
      },
      {
        id: 8,
        grouper: "TABLA_ISR",
        start: 150,
        end: 360,
        value: 28,
        value2: 10,
      },
      {
        id: 9,
        grouper: "TABLA_ISR",
        start: 360,
        end: 640,
        value: 33,
        value2: 69,
      },
      {
        id: 10,
        grouper: "TABLA_ISR",
        start: 640,
        end: 945,
        value: 35,
        value2: 162,
      },
      {
        id: 11,
        grouper: "TABLA_ISR",
        start: 945,
        end: 2300,
        value: 37,
        value2: 268,
      },
      {
        id: 12,
        grouper: "TABLA_ISR",
        start: 2300,
        end: 99999,
        value: 39,
        value2: 770,
      },
      { id: 13, grouper: "TABLA_FONDO_SOLIDARIO", start: 0, end: 4, value: 0 },
      { id: 14, grouper: "TABLA_FONDO_SOLIDARIO", start: 4, end: 16, value: 1 },
      {
        id: 15,
        grouper: "TABLA_FONDO_SOLIDARIO",
        start: 16,
        end: 17,
        value: 1,
      },
      {
        id: 16,
        grouper: "TABLA_FONDO_SOLIDARIO",
        start: 17,
        end: 18,
        value: 1,
      },
      {
        id: 17,
        grouper: "TABLA_FONDO_SOLIDARIO",
        start: 18,
        end: 19,
        value: 2,
      },
      {
        id: 18,
        grouper: "TABLA_FONDO_SOLIDARIO",
        start: 19,
        end: 20,
        value: 2,
      },
      {
        id: 19,
        grouper: "TABLA_FONDO_SOLIDARIO",
        start: 20,
        end: 999999,
        value: 2,
      },
    ]);
  }
}
