import { EGroupers, EDeductionTypes } from "App/Constants/PayrollGenerateEnum";
import { IEmploymentResult, IEmployment } from "App/Interfaces/EmploymentInterfaces";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import { IIncome } from "App/Interfaces/IncomeInterfaces";
import { IRange } from "App/Interfaces/RangeInterfaces";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import { IPayrollGenerateRepository } from "App/Repositories/PayrollGenerateRepository";
import CoreService from "../External/CoreService";

export class PayrollCalculations {
  constructor(
    public payrollGenerateRepository: IPayrollGenerateRepository,
    public formsPeriodRepository: FormsPeriodRepository,
    public coreService: CoreService
  ) {}

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
    formPeriod: IFormPeriod,
    uvtValue: number,
    incomeTaxTable: IRange[]
  ): Promise<void> {
    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeTaxGrouper,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0
      );

    // si tiene dependiente le restamos segun el calculo

    // Si tiene Certificado Alivio tributario le resta

    const tableValue = affectionValue / uvtValue;

    const range = incomeTaxTable.find(
      (i) => tableValue > i.start && tableValue <= i.end
    );

    if (!range) {
      throw new Error("Tabla de la renta no encontrada");
    }

    const isr = (tableValue - range.start) * (range.value / 100) + range.value2;

    const isrValue = (isr * uvtValue).toFixed(2);

    this.payrollGenerateRepository.createDeduction({
      value: Number(isrValue),
      idEmployment: employment.id || 0,
      idTypePayroll: formPeriod.id || 0,
      idTypeDeduction: EDeductionTypes.incomeTax,
      patronalValue: 0,
    });
  }
}
