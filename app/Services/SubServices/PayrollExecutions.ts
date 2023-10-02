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

  async generatePayrollBiweekly(formPeriod: IFormPeriod): Promise<any> {
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
    return Promise.all(
      employments.map(async (employment) => {
        try {
          if (
            !employment.salaryHistories ||
            employment.salaryHistories.length == 0
          ) {
            throw new Error("Salario no ubicado");
          }
          const salary = Number(employment.salaryHistories[0].salary);

          //1. Calcula Licencia
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
          const salaryCalculated = await this.calculateSalary(
            employment,
            formPeriod,
            salary,
            licenceDays?.number,
            incapacitiesDays?.number,
            vacationDays?.number
          );
          // 4. Calcula deducción salud
          const healthDeduction = await this.calculateHealthDeduction(
            employment,
            formPeriod,
            parameters
          );
          // 5. Calcula deducción pensión
          const retirementDeduction = await this.calculateRetirementDeduction(
            employment,
            formPeriod,
            parameters
          );
          // 6. Calcula deducción fondo solidaridad
          const solidarityFund = await this.calculateSolidarityFund(
            employment,
            formPeriod,
            smlvValue,
            solidarityFundTable
          );
          // 7. Calcula deducciones Ciclicas
          const ciclicalDeductions = await this.calculateCiclicalDeductions(
            employment,
            formPeriod
          );
          // 8. Calcula deducciones Eventuales
          const eventualDeductions = await this.calculateEventualDeductions(
            employment,
            formPeriod
          );
          //9. Calcular deducción renta familiares dependientes.
          const relativesDeduction = await this.calculateDeductionRelatives(
            employment,
            formPeriod,
            uvtValue
          );
          // Calcula Renta

          // Ingresos brutos al mes
          const isrCalculated = await this.calculateISR(
            employment,
            formPeriod,
            uvtValue,
            incomeTaxTable
          );
          //calculos de reservas
          //bono de servicio
          const bountyService = await this.calculateReserveServiceBounty(
            employment,
            formPeriod,
            salary,
            15
          );
          //prima de servicio
          const bonusService = await this.calculateReserveServiceBonus(
            employment,
            formPeriod,
            salary,
            15,
            bountyService.value
          );
          //bono de recreación
          const recreationBounty = await this.calculateReserveRecreationBounty(
            employment,
            formPeriod,
            salary,
            15
          );
          //reserva de vacaciones
          const vacationReserve = await this.calculateReserveVationReserve(
            employment,
            formPeriod,
            salary,
            15,
            bountyService.value,
            bonusService.value
          );
          //prima de vacaciones
          const bonusVacation = await this.calculateReserveVacationBonus(
            employment,
            formPeriod,
            salary,
            15,
            bountyService.value,
            bonusService.value
          );
          //prima de navidad
          const bonusChristmas = await this.calculateReserveChristmasBonus(
            employment,
            formPeriod,
            salary,
            15,
            bountyService.value,
            bonusService.value,
            bonusVacation.value
          );
          //censatias
          const severancePay = await this.calculateReserveSeverancePay(
            employment,
            formPeriod,
            15,
            bountyService.value,
            bonusService.value,
            bonusVacation.value,
            bonusChristmas.value
          );
          //interes de cesantias
          const severancePayInterest =
            await this.calculateReserveSeverancePayInterest(
              employment,
              formPeriod,
              severancePay.value
            );

          await this.calculateHistoricalPayroll(
            employment,
            formPeriod,
            salaryCalculated.days,
            salary,
            "Exitoso"
          );

          return {
            licenceDays,
            incapacitiesDays,
            vacationDays,
            salaryCalculated,
            healthDeduction,
            retirementDeduction,
            solidarityFund,
            ciclicalDeductions,
            eventualDeductions,
            relativesDeduction,
            isrCalculated,
            bountyService,
            bonusService,
            recreationBounty,
            vacationReserve,
            bonusVacation,
            bonusChristmas,
            severancePay,
            severancePayInterest,
          };
        } catch (error) {
          // Crea historico Fallido
          await this.calculateHistoricalPayroll(
            employment,
            formPeriod,
            0,
            0,
            "Fallido",
            error
          );
          console.log(error);
          return {
            err: error,
          };
        }
      })
    );
  }
}
