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

    const employments =
      await this.payrollGenerateRepository.getActiveEmployments(
        new Date(String(formPeriod.dateEnd))
      );

    // Busca los parametro o recurosos a utilizar

    const incomeTaxTable =
      await this.payrollGenerateRepository.getRangeByGrouper("TABLA_ISR");
    const solidarityFundTable =
      await this.payrollGenerateRepository.getRangeByGrouper(
        "TABLA_FONDO_SOLIDARIO"
      );

    const parameters = await this.coreService.getParametersByCodes([
      "ISR_VALOR_UVT",
      "PCT_PENSION_EMPLEADO",
      "PCT_PENSION_PATRONAL",
      "PCT_SEGURIDAD_SOCIAL_EMPLEADO",
      "PCT_SEGURIDAD_SOCIAL_PATRONAL",
      "SMLV",
    ]);

    const uvtValue = Number(
      parameters.find((i) => (i.id = "ISR_VALOR_UVT"))?.value || 0
    );

    const smlvValue = Number(
      parameters.find((i) => i.id == "SMLV")?.value || 0
    );
    Promise.all(
      employments.map(async (employment) => {
        try {
          if (
            !employment.salaryHistories ||
            employment.salaryHistories.length == 0
          ) {
            throw new Error("Salario no ubicado");
          }
          const salary = Number(employment.salaryHistories[0].salary);

          // 1. Calcula Licencia
          const licenceDays = await this.calculateLicense(
            employment,
            formPeriod,
            salary
          );

          // 2. Calcula Incapacidades
          const incapacitiesDays = await this.calculateIncapacity(
            employment,
            formPeriod,
            salary
          );

          // 3. Calcula Vacaciones
          const vacationDays = await this.calculateVacation(
            employment,
            formPeriod
          );

          //4. Calcula ingreso por salario
          await this.calculateSalary(
            employment,
            formPeriod,
            salary,
            licenceDays,
            incapacitiesDays,
            vacationDays
          );
          // 4. Calcula deducción salud
          await this.calculateHealthDeduction(
            employment,
            formPeriod,
            parameters
          );
          // 5. Calcula deducción pensión
          await this.calculateRetirementDeduction(
            employment,
            formPeriod,
            parameters
          );
          // 6. Calcula deducción fondo solidaridad
          await this.calculateSolidarityFund(
            employment,
            formPeriod,
            smlvValue,
            solidarityFundTable
          );
          // 7. Calcula deducciones Ciclicas

          // 8. Calcula deducciones Eventuales
          await this.calculateEventualDeductions(
            employment,formPeriod
          );
          // Calcula Renta

          // Ingresos brutos al mes
          await this.calculateISR(
            employment,
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
