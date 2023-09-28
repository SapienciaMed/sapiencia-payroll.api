import {
  EGroupers,
  EDeductionTypes,
  EIncomeTypes,
} from "App/Constants/PayrollGenerateEnum";
import {
  IEmploymentResult,
  IEmployment,
} from "App/Interfaces/EmploymentInterfaces";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import { IIncome } from "App/Interfaces/IncomeInterfaces";
import { IRange } from "App/Interfaces/RangeInterfaces";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import { IPayrollGenerateRepository } from "App/Repositories/PayrollGenerateRepository";
import CoreService from "../External/CoreService";
import { IDeduction } from "App/Interfaces/DeductionsInterfaces";
import { IParameter } from "App/Interfaces/CoreInterfaces";
import { addCalendarDays, calculateDifferenceDays } from "App/Utils/functions";
import Incapacity from "../../Models/Incapacity";

export class PayrollCalculations {
  constructor(
    public payrollGenerateRepository: IPayrollGenerateRepository,
    public formsPeriodRepository: FormsPeriodRepository,
    public coreService: CoreService
  ) {}

  async calculateLicense(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number
  ): Promise<number> {
    let daysLicencePaid = 0;
    let daysLicenceUnpaid = 0;
    const valueDay = salary / 30;

    if (employment.id) {
      const licences =
        await this.payrollGenerateRepository.getLicencesPeriodByEmployment(
          employment.id,
          formPeriod.dateStart,
          formPeriod.dateEnd
        );

      console.log(licences);

      if (licences.length == 0) {
        return 0;
      }

      for (const licence of licences) {
        if (licence.licenceType.paid) {
          daysLicencePaid += calculateDifferenceDays(
            licence.dateStart,
            licence.dateEnd
          );
        } else {
          daysLicenceUnpaid += calculateDifferenceDays(
            licence.dateStart,
            licence.dateEnd
          );
        }
      }

      const income = {
        idTypePayroll: formPeriod.id,
        idEmployment: employment.id,
        idTypeIncome: EIncomeTypes.license,
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
    formPeriod: IFormPeriod,
    salary: number
  ): Promise<number> {
    let incapacitiesGeneralDays = 0;
    let incapacitiesLaboralDays = 0;
    let incapacityDayValue = 0;
    const valueDay = salary / 30;

    if (employment.id) {
      const incapicities =
        await this.payrollGenerateRepository.getIncapacitiesPeriodByEmployment(
          employment.id,
          formPeriod.dateEnd
        );

      if (incapicities.length == 0) {
        return 0;
      }

      for (const incapacity of incapicities) {
        // 2. cargamos la tabla de incapaciada
        const IncapacityTable =
          await this.payrollGenerateRepository.getRangeByGrouper(
            incapacity.typeIncapacity?.rangeGrouper || ""
          );

        // 1. deteminar los dias a procesar.
        let initDate;
        let endDate;
        let daysProcessed = 0;
        let daysToProcess = 0;
        const maxDays = 15;
        const totalDays = calculateDifferenceDays(
          incapacity.dateInitial,
          incapacity.dateFinish
        );

        if (!incapacity.daysProcessed || incapacity.daysProcessed.length == 0) {
          initDate = incapacity.dateInitial;
        } else {
          initDate = addCalendarDays(
            incapacity.daysProcessed.sort((a, b) => a.id - b.id)[
              incapacity.daysProcessed.length - 1
            ].endDate,
            1,
            false
          );

          daysProcessed = incapacity.daysProcessed.reduce(
            (sum, i) => sum + i.days,
            0
          );
        }

        daysToProcess =
          totalDays - daysToProcess >= maxDays
            ? maxDays
            : totalDays - daysToProcess;
        
        endDate = addCalendarDays(initDate,daysToProcess)



        if (
          incapacity.typeIncapacity?.rangeGrouper ==
          "INCAPACIDAD_ENFERMEDAD_COMUN"
        ) {
          incapacitiesGeneralDays += calculateDifferenceDays(
            incapacity.dateInitial,
            incapacity.dateFinish
          );
        } else {
          incapacitiesLaboralDays += calculateDifferenceDays(
            incapacity.dateInitial,
            incapacity.dateFinish
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
        idTypeIncome: EIncomeTypes.incapacity,
        value: incapacityDayValue + Number(incapacitiesLaboralDays) * valueDay,
        time: Number(incapacitiesGeneralDays) + Number(incapacitiesLaboralDays),
        unitTime: "Dias",
      };
      console.log(income);
      await this.payrollGenerateRepository.createIncome(income as IIncome);

      return Number(incapacitiesGeneralDays) + Number(incapacitiesLaboralDays);
    }

    return 0;
  }

  async calculateVacation(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod
  ): Promise<number> {
    let vacationDays = 0;
    //const valueDay = Number(employment.charge?.baseSalary) / 30;
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
          vacationDays += Number(vacationDay.enjoyedDays);
        }
      }
      const income = {
        idTypePayroll: formPeriod.id,
        idEmployment: employment.id,
        idTypeIncome: EIncomeTypes.vacation,
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
    salary: number,
    licencesDays: number,
    incapacities: number,
    vacationDays: number
  ): Promise<void> {
    let daysSalary = 0;
    const valueDay = salary / 30;
    if (employment.startDate < formPeriod.dateStart) {
      daysSalary += 15 - licencesDays - incapacities - vacationDays;
    } else {
      daysSalary +=
        Number(
          calculateDifferenceDays(employment.startDate, formPeriod.dateEnd)
        ) -
        licencesDays -
        incapacities -
        vacationDays;
    }

    const income = {
      idTypePayroll: formPeriod.id,
      idEmployment: employment.id,
      idTypeIncome: EIncomeTypes.salary,
      value: Number(valueDay * (daysSalary < 0 ? 0 : daysSalary)),
      time: daysSalary < 0 ? 0 : daysSalary,
      unitTime: "Dias",
    };
    await this.payrollGenerateRepository.createIncome(income as IIncome);

    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
  }

  async calculateHealthDeduction(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    parameter: IParameter[]
  ) {
    const deductionType =
      await this.payrollGenerateRepository.getDeductionTypesByName(
        "Seguridad Social"
      );
    const employeeValue = Number(
      parameter.find((item) => (item.id = "PCT_SEGURIDAD_SOCIAL_EMPLEADO"))
        ?.value
    );
    const employerValue = Number(
      parameter.find((item) => (item.id = "PCT_SEGURIDAD_SOCIAL_PATRONAL"))
        ?.value
    );
    const deduction = {
      idTypePayroll: formPeriod.id,
      idEmployment: employment.id,
      idTypeDeduction: deductionType.id,
      value:
        (Number(employment.charge?.baseSalary) / 2) * (employeeValue / 100),
      patronalValue:
        (Number(employment.charge?.baseSalary) / 2) * (employerValue / 100),
      time: 15,
      unitTime: "Dias",
    };
    await this.payrollGenerateRepository.createDeduction(
      deduction as IDeduction
    );
  }

  async calculateRetirementDeduction(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    parameter: IParameter[]
  ) {
    const deductionType =
      await this.payrollGenerateRepository.getDeductionTypesByName("Pension");
    const employeeValue = Number(
      parameter.find((item) => (item.id = "PCT_PENSION_EMPLEADO"))?.value
    );
    const employerValue = Number(
      parameter.find((item) => (item.id = "PCT_PENSION_PATRONAL"))?.value
    );
    const deduction = {
      idTypePayroll: formPeriod.id,
      idEmployment: employment.id,
      idTypeDeduction: deductionType.id,
      value:
        (Number(employment.charge?.baseSalary) / 2) * (employeeValue / 100),
      patronalValue:
        (Number(employment.charge?.baseSalary) / 2) * (employerValue / 100),
      time: 15,
      unitTime: "Dias",
    };
    await this.payrollGenerateRepository.createDeduction(
      deduction as IDeduction
    );
  }

  async calculateSolidarityFund(
    employment: IEmployment,
    formPeriod: IFormPeriod,
    smlv: number,
    solidarityFundTable: IRange[]
  ): Promise<void> {
    const affectionValue =
      await this.payrollGenerateRepository.getSalarybyEmployment(
        employment?.id || 0
      );

    // si tiene dependiente le restamos segun el calculo

    // Si tiene Certificado Alivio tributario le resta

    const tableValue = Number(affectionValue.salary) / smlv;

    const range = solidarityFundTable.find(
      (i) => tableValue > i.start && tableValue <= i.end
    );

    if (!range) {
      throw new Error("Tabla de la renta no encontrada");
    }

    const solidarityFundValue =
      (tableValue - range.start) * (range.value / 100);

    const solidarityFundValueFixed = (solidarityFundValue * smlv).toFixed(2);

    this.payrollGenerateRepository.createDeduction({
      value: Number(solidarityFundValueFixed),
      idEmployment: employment.id || 0,
      idTypePayroll: formPeriod.id || 0,
      idTypeDeduction: EDeductionTypes.solidarityFund,
      patronalValue: 0,
    });
  }

  async calculateEventualDeductions(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod
  ): Promise<void> {
    const affectionValue =
      await this.payrollGenerateRepository.getSalarybyEmployment(
        employment?.id || 0
      );
    if (employment.id) {
      const eventualDeductions =
        await this.payrollGenerateRepository.getEventualDeductionsByEmployment(
          employment.id,
          formPeriod.id || 0
        );

      if (eventualDeductions.length == 0) {
        return;
      }
      const deductions = eventualDeductions.map((eventualDeduction) => {
        if (eventualDeduction.porcentualValue) {
          return {
            value:
              ((Number(eventualDeduction.value) / 100) *
                Number(affectionValue)) /
              2,
            idEmployment: employment.id || 0,
            idTypePayroll: formPeriod.id || 0,
            idTypeDeduction: eventualDeduction.codDeductionType || 0,
            patronalValue: 0,
          };
        } else {
          return {
            value: eventualDeduction.value / 2,
            idEmployment: employment.id || 0,
            idTypePayroll: formPeriod.id || 0,
            idTypeDeduction: eventualDeduction.codDeductionType || 0,
            patronalValue: 0,
          };
        }
      });

      await this.payrollGenerateRepository.createManyDeduction(deductions);
    }
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
