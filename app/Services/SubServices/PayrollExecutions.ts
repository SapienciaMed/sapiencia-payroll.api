import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import { IPayrollGenerateRepository } from "App/Repositories/PayrollGenerateRepository";
import CoreService from "../External/CoreService";
import { PayrollCalculations } from "./PayrollCalculations";

export class PayrollExecutions extends PayrollCalculations {
  constructor(
    public payrollGenerateRepository: IPayrollGenerateRepository,
    public formsPeriodRepository: FormsPeriodRepository,
    public coreService: CoreService
  ) {
    super(payrollGenerateRepository, formsPeriodRepository, coreService);
  }

  async generatePayrollBiweekly(formPeriod: IFormPeriod): Promise<void> {
    //buscar los empelados activos de la planilla quincenal.

    const emploments = await this.payrollGenerateRepository.getActiveEmploments(
      new Date(String(formPeriod.dateEnd))
    );

    // Busca los parametro o recurosos a utilizar

    const incomeTaxTable =
      await this.payrollGenerateRepository.getRangeByGrouper("TABLA_ISR");

    const parameters = await this.coreService.getParametersByCodes([
      "ISR_VALOR_UVT",
    ]);

    const uvtValue = Number(
      parameters.find((i) => (i.id = "ISR_VALOR_UVT"))?.value || 0
    );

    Promise.all(
      emploments.map(async (emploment) => {
        try {
          // // 1. Calcula Licencia
          // const licenceDays = await this.calculateLicense(
          //   emploment,
          //   formPeriod
          // );

          // // 2. Calcula Incapacidades
          // const incapacitiesDays = await this.calculateIncapacity(
          //   emploment,
          //   formPeriod
          // );

          // // 3. Calcula Vacaciones
          // const vacationDays = await this.calculateVacation(
          //   emploment,
          //   formPeriod
          // );

          // //4. Calcula ingreso por salario
          // await this.calculateSalary(
          //   emploment,
          //   formPeriod,
          //   licenceDays,
          //   incapacitiesDays,
          //   vacationDays
          // );
          // 4. Calcula deducción salud

          // 5. Calcula deducción pensión

          // 6. Calcula deducción fondo solidaridad

          // 7. Calcula deducciones Ciclicas

          // 8. Calcula deducciones Eventuales

          // Calcula Renta

          // Ingresos brutos al mes
          await this.calculateISR(
            emploment,
            formPeriod,
            uvtValue,
            incomeTaxTable
          );
        } catch (error) {
          // Crea historico Fallido
          console.log(error);
        }
      })
    );
  }
}
