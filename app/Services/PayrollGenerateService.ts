import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IPayrollGenerateRepository } from "../Repositories/PayrollGenerateRepository";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import {
  IEmployment,
  IEmploymentResult,
} from "App/Interfaces/EmploymentInterfaces";
import { IIncome } from "App/Interfaces/IncomeInterfaces";

import CoreService from "./External/CoreService";

export interface IPayrollGenerateService {
  payrollGenerateById(id: number): Promise<ApiResponse<boolean>>;
}

export default class PayrollGenerateService implements IPayrollGenerateService {
  constructor(
    private payrollGenerateRepository: IPayrollGenerateRepository,
    private formsPeriodRepository: FormsPeriodRepository,
    private coreService: CoreService
  ) {}

  async payrollGenerateById(id: number): Promise<ApiResponse<boolean>> {
    const formPeriod = await this.formsPeriodRepository.getFormPeriodById(id);

    // 1. Validar si la planilla esta autorizada o no existe el periodo
    if (!formPeriod || formPeriod.state === "Autorizada") {
      return new ApiResponse(false, EResponseCodes.FAIL, "....");
    }

    // 2. Elimina todos los elemento calculados (Historico, Reservas, Ingresos ...)
    // await this.payrollGenerateRepository.deleteIncomes(id);
    // await this.payrollGenerateRepository.deleteDeductions(id);
    // await this.payrollGenerateRepository.deleteReserves(id);
    // await this.payrollGenerateRepository.deleteHistoryPayroll(id);
    // 3. Genera la planilla segun el tipo
    switch (formPeriod.idFormType) {
      case 1: // Planilla Quincenal
        await this.generatePayrollBiweekly(formPeriod);
        break;

      default:
        break;
    }

    return new ApiResponse(true, EResponseCodes.OK);
  }

  async generatePayrollBiweekly(formPeriod: IFormPeriod): Promise<void> {
    //buscar los empelados activos de la planilla quincenal.

    const emploments = await this.payrollGenerateRepository.getActiveEmploments(
      new Date(String(formPeriod.dateEnd))
    );

    Promise.all(
      emploments.map(async (emploment) => {
        try {
          // 1. Calcula Licencia
          const licenceDays = await this.calculateLicense(
            emploment,
            formPeriod
          );

          // 2. Calcula Incapacidades
          const incapacitiesDays = await this.calculateIncapacity(
            emploment,
            formPeriod
          );

          // 3. Calcula Vacaciones
          const vacationDays = await this.calculateVacation(
            emploment,
            formPeriod
          );

          //4. Calcula ingreso por salario
          await this.calculateSalary(
            emploment,
            formPeriod,
            licenceDays,
            incapacitiesDays,
            vacationDays
          );
          // 4. Calcula deducción salud

          // 5. Calcula deducción pensión

          // 6. Calcula deducción fondo solidaridad

          // 7. Calcula deducciones Ciclicas

          // 8. Calcula deducciones Eventuales

          // Calcula Renta

          const response = await this.coreService.getParametersByCodes([
            "ISR_VALOR_UVT",
            "",
          ]);

          console.log(response);

          // Ingresos brutos al mes
          await this.calculateISR(emploment, formPeriod);

          // Ingresos no constituvios de renta
          await this.calculateINCR(emploment, formPeriod);

          //Deducciones retefuente
          await this.calculateDR(emploment, formPeriod);

          //Rentas exentas
          await this.calculateRE(emploment, formPeriod);
        } catch (error) {
          // Crea historico Fallido
          console.log(error);
        }
      })
    );
  }

  async calculateLicense(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod
  ): Promise<number> {
    let daysLicencePaid = 0;
    let daysLicenceUnpaid = 0;
    const valueDay = Number(employment.charge?.baseSalary) / 30;
    const typeIncome =
      await this.payrollGenerateRepository.getIncomesTypesByName("Licencias");
    if (employment.id) {
      const licences =
        await this.payrollGenerateRepository.getLicencesPeriodByEmployment(
          employment.id,
          formPeriod.dateStart,
          formPeriod.dateEnd
        );

      if (licences.length == 0) {
        return 0;
      }
      for (const licence of licences) {
        if (licence.type.paid) {
          daysLicencePaid += Number(
            licence.dateEnd.diff(licence.dateStart, ["days"]).toObject()
          );
        } else {
          daysLicenceUnpaid += Number(
            licence.dateEnd.diff(licence.dateStart, ["days"]).toObject()
          );
        }
      }
      const income = {
        idTypePayroll: formPeriod.id,
        idEmployment: employment.id,
        idTypeIncome: typeIncome.id,
        value: Number(valueDay * daysLicencePaid),
        time: daysLicencePaid + daysLicenceUnpaid,
        unitTime: "Dias",
      };
      await this.payrollGenerateRepository.createIncome(income as IIncome);

      return Number(daysLicencePaid + daysLicenceUnpaid);
    }
    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
    return 0;
  }

  async calculateIncapacity(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod
  ): Promise<number> {
    let incapacitiesGeneralDays = 0;
    let incapacitiesLaboralDays = 0;
    let incapacityDayValue = 0;
    const valueDay = Number(employment.charge?.baseSalary) / 30;
    const typeIncome =
      await this.payrollGenerateRepository.getIncomesTypesByName("Incapacidad");
    if (employment.id) {
      const incapicities =
        await this.payrollGenerateRepository.getIncapacitiesPeriodByEmployment(
          employment.id,
          formPeriod.dateStart,
          formPeriod.dateEnd
        );

      if (incapicities.length == 0) {
        return 0;
      }
      for (const incapacity of incapicities) {
        if (
          incapacity.typeIncapacity?.rangeGrouper ==
          "INCAPACIDAD_ENFERMEDAD_COMUN"
        ) {
          incapacitiesGeneralDays += Number(
            incapacity.dateFinish
              .diff(incapacity.dateInitial, ["days"])
              .toObject()
          );
        } else {
          incapacitiesGeneralDays += Number(
            incapacity.dateFinish
              .diff(incapacity.dateInitial, ["days"])
              .toObject()
          );
        }
      }

      for (let dia = 1; dia <= incapacitiesGeneralDays; dia++) {
        if (dia <= 2) {
          incapacityDayValue += 1.0 * valueDay; // 100% de pago para los primeros 2 días
        } else if (dia <= 180) {
          incapacityDayValue += 0.6667 * valueDay; // 66.67% de pago del día 3 al 180
        } else if (dia <= 540) {
          incapacityDayValue += 0.5 * valueDay; // 50% de pago del día 181 al 540
        } else {
          break; // No hay pago para más de 540 días
        }
      }

      const income = {
        idTypePayroll: formPeriod.id,
        idEmployment: employment.id,
        idTypeIncome: typeIncome.id,
        value: incapacityDayValue + Number(incapacitiesLaboralDays) * valueDay,
        time: Number(incapacitiesGeneralDays) + Number(incapacitiesLaboralDays),
        unitTime: "Dias",
      };
      await this.payrollGenerateRepository.createIncome(income as IIncome);

      return Number(incapacitiesGeneralDays) + Number(incapacitiesLaboralDays);
    }
    // 1. buscar incapacidades vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
    return 0;
  }

  async calculateVacation(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod
  ): Promise<number> {
    let vacationDays = 0;
    //const valueDay = Number(employment.charge?.baseSalary) / 30;
    const typeIncome =
      await this.payrollGenerateRepository.getIncomesTypesByName("Vacaciones");
    if (employment.id) {
      const vacations =
        await this.payrollGenerateRepository.getVacationsPeriodByEmployment(
          employment.id,
          formPeriod.dateStart,
          formPeriod.dateEnd
        );

      if (vacations.length == 0) {
        return 0;
      }
      for (const vacation of vacations) {
        for (const vacationDay of vacation.vacationDay) {
          if (!vacationDay.paid) {
            vacationDays += Number(
              vacationDay?.dateUntil
                ?.diff(vacation.dateFrom, ["days"])
                .toObject()
            );
          } else {
            vacationDays += Number(vacationDay.enjoyedDays);
          }
        }
      }
      const income = {
        idTypePayroll: formPeriod.id,
        idEmployment: employment.id,
        idTypeIncome: typeIncome.id,
        value: 0,
        time: vacationDays,
        unitTime: "Dias",
      };
      await this.payrollGenerateRepository.createIncome(income as IIncome);
      return vacationDays;
    }
    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
    return 0;
  }

  async calculateSalary(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    licencesDays: number,
    incapacities: number,
    vacationDays: number
  ): Promise<void> {
    let daysSalary = 0;
    const valueDay = Number(employment.charge?.baseSalary) / 30;
    if (employment.startDate < formPeriod.dateStart) {
      daysSalary += 15 - licencesDays - incapacities - vacationDays;
    } else {
      daysSalary +=
        Number(formPeriod.dateEnd.diff(employment.startDate)) -
        licencesDays -
        incapacities -
        vacationDays;
    }

    const typeIncome =
      await this.payrollGenerateRepository.getIncomesTypesByName("Salario");
    const income = {
      idTypePayroll: formPeriod.id,
      idEmployment: employment.id,
      idTypeIncome: typeIncome.id,
      value: Number(valueDay * (daysSalary < 0 ? 0 : daysSalary)),
      time: daysSalary < 0 ? 0 : daysSalary,
      unitTime: "Dias",
    };
    await this.payrollGenerateRepository.createIncome(income as IIncome);

    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
  }

  async calculateISR(
    employment: IEmployment,
    formPeriod: IFormPeriod
  ): Promise<number> {
    const valueIncomePerMonth =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        1,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0
      );

    return valueIncomePerMonth;
  }

  async calculateINCR(
    employment: IEmployment,
    formPeriod: IFormPeriod
  ): Promise<number> {
    const valueConstitutiveIncome =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        2,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0
      );

    return valueConstitutiveIncome;
  }

  async calculateDR(
    employment: IEmployment,
    formPeriod: IFormPeriod
  ): Promise<number> {
    const valueDeductionReteFuente =
      await this.payrollGenerateRepository.getMonthlyDeductionValuePerGrouper(
        3,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0
      );

    return valueDeductionReteFuente;
  }

  async calculateRE(
    employment: IEmployment,
    formPeriod: IFormPeriod
  ): Promise<number> {
    const valueIncomeExempt =
      await this.payrollGenerateRepository.getMonthlyDeductionValuePerGrouper(
        4,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0
      );

    return valueIncomeExempt;
  }
}

// class PayrollBiweekly {
//   constructor(private payrollGenerateRepository: IPayrollGenerateRepository) {}

//   async payrollGenerateById(id: number): Promise<ApiResponse<boolean>> {
//     const formsPeriod = await this.formsPeriodRepository.getFormPeriodById(id);

//     // Validar si la planilla esta autorizada o no existe el period
//     if (!formsPeriod || formsPeriod.length === 0) {
//       return new ApiResponse(false, EResponseCodes.FAIL, "....");
//     }

//     switch (formsPeriod[1].idFormType) {
//       case 1: // Planilla Quincenal
//         break;

//       default:
//         break;
//     }

//     return new ApiResponse(true, EResponseCodes.OK);
//   }
// }
