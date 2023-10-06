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

          // //calcular planilla vacaciones
          // const result = await this.calculateVacationSpreadsheet(
          //   employment,
          //   formPeriod,
          //   salary,
          //   vacationDays.number ?? 0
          // );

          // console.log(result);

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
            salaryCalculated.days
          );
          //prima de servicio
          const bonusService = await this.calculateReserveServiceBonus(
            employment,
            formPeriod,
            salary,
            salaryCalculated.days,
            bountyService.value
          );
          //bono de recreación
          const recreationBounty = await this.calculateReserveRecreationBounty(
            employment,
            formPeriod,
            salary,
            salaryCalculated.days
          );
          //reserva de vacaciones
          const vacationReserve = await this.calculateReserveVacationReserve(
            employment,
            formPeriod,
            salary,
            salaryCalculated.days,
            bountyService.value,
            bonusService.value
          );
          //reserva de vacaciones (bonus)
          const bonusVacation = await this.calculateReserveVacationBonus(
            employment,
            formPeriod,
            salary,
            salaryCalculated.days,
            bountyService.value,
            bonusService.value
          );
          //reserva de navidad
          const bonusChristmas = await this.calculateReserveChristmasBonus(
            employment,
            formPeriod,
            salary,
            salaryCalculated.days,
            bountyService.value,
            bonusService.value,
            bonusVacation.value
          );
          //censatias
          const severancePay = await this.calculateReserveSeverancePay(
            employment,
            formPeriod,
            salaryCalculated.days,
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
              severancePay.value,
              salaryCalculated.days
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
            ""
          );
          console.log(error);
          return {
            err: error,
          };
        }
      })
    );
  }

  async generatePayrollMonthly(formPeriod: IFormPeriod): Promise<any> {
    //buscar los empelados activos de la planilla Mensual(contratista).

    const employments =
      await this.payrollGenerateRepository.getActiveEmploymentsContracts(
        new Date(String(formPeriod.dateEnd))
      );

    // Busca los parametro o recurosos a utilizar

    const incomeTaxTable =
      await this.payrollGenerateRepository.getRangeByGrouper("TABLA_ISR");

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
          const suspensionDays = await this.calculateSuspension(
            employment,
            formPeriod
          );

          //4. Calcula ingreso por salario
          const salaryCalculated = await this.calculateSalarycontractor(
            employment,
            formPeriod,
            salary,
            suspensionDays.number
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

          await this.calculateHistoricalPayroll(
            employment,
            formPeriod,
            salaryCalculated.days,
            salary,
            "Exitoso"
          );

          return {
            suspensionDays,
            salaryCalculated,
            ciclicalDeductions,
            eventualDeductions,
            relativesDeduction,
            isrCalculated,
          };
        } catch (error) {
          // Crea historico Fallido
          await this.calculateHistoricalPayroll(
            employment,
            formPeriod,
            0,
            0,
            "Fallido",
            ""
          );
          console.log(error);
          return {
            err: error,
          };
        }
      })
    );
  }

  async generatePayrollVacations(formPeriod: IFormPeriod): Promise<any> {
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

          //1. calcular dias vacaciones
          const vacationDays = await this.calculateVacation(
            employment,
            formPeriod
          );

          //2. Calcula bonificacion vacaciones
          const calculateVacationsBonus = await this.calculateVacationsBonus(
            employment,
            formPeriod,
            salary,
            vacationDays.number
          );

          //3. Calcula deduccion salud
          const calculatedDeductionHealth = await this.calculateHealthDeduction(
            employment,
            formPeriod,
            parameters
          );

          // 4. Calcula deduccion de pension
          const calculatedDeductionPension =
            await this.calculateRetirementDeduction(
              employment,
              formPeriod,
              parameters
            );

          //5. Fondo solidaridad deduccion
          const calculatedSolidarityFund = await this.calculateSolidarityFund(
            employment,
            formPeriod,
            smlvValue,
            solidarityFundTable
          );

          // 6. Deducciones ciclicas
          const deductionsCiclical = await this.calculateCiclicalDeductions(
            employment,
            formPeriod
          );

          // 7. Deducciones eventuales
          const deductionEvetual = await this.calculateEventualDeductions(
            employment,
            formPeriod
          );

          // Calcula Renta

          // Ingresos brutos al mes
          const isrCalculated = await this.calculateISR(
            employment,
            formPeriod,
            uvtValue,
            incomeTaxTable
          );

          return {
            vacationDays,
            calculateVacationsBonus,
            calculatedDeductionHealth,
            calculatedDeductionPension,
            calculatedSolidarityFund,
            deductionsCiclical,
            deductionEvetual,
            isrCalculated,
          };
        } catch (error) {
          // Crea historico Fallido
          await this.calculateHistoricalPayroll(
            employment,
            formPeriod,
            0,
            0,
            "Fallido",
            ""
          );
          console.log(error);
          return {
            err: error,
          };
        }
      })
    );
  }

  async generatePayrollBountyService(formPeriod: IFormPeriod): Promise<any> {
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
      "SERVICE_BOUNTY",
    ]);

    const uvtValue = Number(
      parameters.find((i) => (i.id = "ISR_VALOR_UVT"))?.value || 0
    );

    const smlvValue = Number(
      parameters.find((i) => i.id == "SMLV")?.value || 0
    );

    const serviceBountyPercentage = Number(
      parameters.find((i) => i.id == "SERVICE_BOUNTY")?.value || 0
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

          //1. Calcula bonificacion servicio
          const calculateServiceBounty = await this.calculateServiceBounty(
            employment,
            formPeriod,
            salary,
            serviceBountyPercentage,
            360
          );

          //3. Calcula deduccion salud
          const calculatedDeductionHealth = await this.calculateHealthDeduction(
            employment,
            formPeriod,
            parameters
          );

          // 4. Calcula deduccion de pension
          const calculatedDeductionPension =
            await this.calculateRetirementDeduction(
              employment,
              formPeriod,
              parameters
            );

          //5. Fondo solidaridad deduccion
          const calculatedSolidarityFund = await this.calculateSolidarityFund(
            employment,
            formPeriod,
            smlvValue,
            solidarityFundTable
          );

          // 6. Deducciones ciclicas
          const deductionsCiclical = await this.calculateCiclicalDeductions(
            employment,
            formPeriod
          );

          // 7. Deducciones eventuales
          const deductionEvetual = await this.calculateEventualDeductions(
            employment,
            formPeriod
          );

          // Calcula Renta

          // Ingresos brutos al mes
          const isrCalculated = await this.calculateISR(
            employment,
            formPeriod,
            uvtValue,
            incomeTaxTable
          );

          return {
            calculateServiceBounty,
            calculatedDeductionHealth,
            calculatedDeductionPension,
            calculatedSolidarityFund,
            deductionsCiclical,
            deductionEvetual,
            isrCalculated,
          };
        } catch (error) {
          // Crea historico Fallido
          await this.calculateHistoricalPayroll(
            employment,
            formPeriod,
            0,
            0,
            "Fallido",
            ""
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
