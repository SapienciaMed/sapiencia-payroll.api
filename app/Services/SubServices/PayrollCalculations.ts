import {
  EGroupers,
  EDeductionTypes,
  EIncomeTypes,
} from "App/Constants/PayrollGenerateEnum";
import { IEmploymentResult } from "App/Interfaces/EmploymentInterfaces";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import { IIncome } from "App/Interfaces/IncomeInterfaces";
import { IRange } from "App/Interfaces/RangeInterfaces";
import FormsPeriodRepository from "App/Repositories/FormsPeriodRepository";
import { IPayrollGenerateRepository } from "App/Repositories/PayrollGenerateRepository";
import CoreService from "../External/CoreService";
import { IDeduction } from "App/Interfaces/DeductionsInterfaces";
import { IParameter } from "App/Interfaces/CoreInterfaces";
import { addCalendarDays, calculateDifferenceDays } from "App/Utils/functions";
import { DateTime } from "luxon";

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
  ): Promise<{ income?: object; number: number }> {
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
        return { number: Number(daysLicencePaid + daysLicenceUnpaid) ?? 0 };
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

      //return Number(daysLicencePaid + daysLicenceUnpaid);
      return {
        income,
        number: Number(daysLicencePaid + daysLicenceUnpaid) ?? 0,
      };
    }
    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
    return { number: Number(daysLicencePaid + daysLicenceUnpaid) ?? 0 };
  }

  async calculateIncapacity(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number
  ): Promise<{
    income?: object;
    IncapacityDaysProcessed?: object;
    number: number;
  }> {
    let daysToReturn = 0;
    const result = [{}];
    const toProccess: [{ days: number; pct: number }] = [{ days: 0, pct: 0 }];

    if (employment.id) {
      const incapicities =
        await this.payrollGenerateRepository.getIncapacitiesPeriodByEmployment(
          employment.id,
          formPeriod.dateEnd
        );

      if (incapicities.length == 0) {
        return { number: daysToReturn ?? 0 };
      }

      for (const incapacity of incapicities) {
        // 1. cargamos la tabla de incapaciada
        const incapacityTable =
          await this.payrollGenerateRepository.getRangeByGrouper(
            incapacity.typeIncapacity?.rangeGrouper || ""
          );

        // 2. deteminar los dias a procesar y fecha de inicio y fin
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
          // Si la incapacidad se iniciaria a procesar
          initDate = new Date(String(incapacity.dateInitial));
        } else {
          // sino se contabiliza los dias procesados
          initDate = addCalendarDays(
            incapacity.daysProcessed[incapacity.daysProcessed.length - 1]
              .endDate,
            1,
            false
          );

          daysProcessed = incapacity.daysProcessed.reduce(
            (sum, i) => sum + i.days,
            0
          );
        }

        daysToProcess =
          totalDays - daysProcessed >= maxDays
            ? maxDays
            : totalDays - daysProcessed;

        endDate = addCalendarDays(initDate, daysToProcess);

        let startDayProcess = daysProcessed + 1;
        const endDayProcess = daysProcessed + daysToProcess;
        // Recorre la tabla para establecer los dias a procesar
        for (const table of incapacityTable) {
          if (startDayProcess > table.start && startDayProcess <= table.end) {
            if (endDayProcess > table.start && endDayProcess <= table.end) {
              // si todos los rangos se encuentran en el mismo rango
              toProccess.push({
                days: endDayProcess - startDayProcess + 1,
                pct: table.value,
              });
              break;
            } else {
              // Sino se contabiliza los dias hasta el fin del rango
              toProccess.push({
                days: table.end - startDayProcess + 1,
                pct: table.value,
              });
              startDayProcess = table.end + 1;
            }
          }
        }

        // Guarda el registro de los dias procesados
        await this.payrollGenerateRepository.createIncapacityDaysProcessed({
          codFormPeriod: formPeriod.id || 0,
          codIncapcity: incapacity.id || 0,
          days: daysToProcess,
          startDate: DateTime.fromJSDate(initDate),
          endDate: DateTime.fromJSDate(endDate),
        });
        result.push({
          codFormPeriod: formPeriod.id || 0,
          codIncapcity: incapacity.id || 0,
          days: daysToProcess,
          startDate: DateTime.fromJSDate(initDate),
          endDate: DateTime.fromJSDate(endDate),
        });
        daysToReturn = daysToReturn + daysToProcess;
      }

      // Calcula el valor a pagar de todas la incapacidees
      const toPay = toProccess.reduce(
        (sum, i) => sum + (salary / 30) * (i.pct / 100) * i.days,
        0
      );

      await this.payrollGenerateRepository.createIncome({
        idTypePayroll: formPeriod.id || 0,
        idEmployment: employment.id,
        idTypeIncome: EIncomeTypes.incapacity,
        value: Math.round(toPay),
        time: daysToReturn,
        unitTime: "Dias",
      });
      return {
        income: {
          idTypePayroll: formPeriod.id || 0,
          idEmployment: employment.id,
          idTypeIncome: EIncomeTypes.incapacity,
          value: Math.round(toPay),
          time: daysToReturn,
          unitTime: "Dias",
        },
        IncapacityDaysProcessed: result,
        number: daysToReturn ?? 0,
      };
    }
    return { number: daysToReturn ?? 0 };
    // return daysToReturn;
  }

  async calculateVacation(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod
  ): Promise<{ income?: object; number: number }> {
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
        return { number: vacationDays ?? 0 };
        // return 0;
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
      return { income, number: vacationDays ?? 0 };
      //return vacationDays;
    }
    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
    return { number: vacationDays ?? 0 };
  }

  async calculateSalary(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    licencesDays: number,
    incapacities: number,
    vacationDays: number
  ): Promise<object> {
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
    return { income };
    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
  }

  async calculateHealthDeduction(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    parameter: IParameter[]
  ): Promise<object> {
    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeCyclicDeduction,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0,
        formPeriod.id
      );
    const employeeValue = Number(
      parameter.find((item) => item.id == "PCT_SEGURIDAD_SOCIAL_EMPLEADO")
        ?.value
    );
    const employerValue = Number(
      parameter.find((item) => item.id == "PCT_SEGURIDAD_SOCIAL_PATRONAL")
        ?.value
    );
    const deduction = {
      idTypePayroll: formPeriod.id,
      idEmployment: employment.id,
      idTypeDeduction: EDeductionTypes.SocialSecurity,
      value: (Number(affectionValue) / 2) * (employeeValue / 100),
      patronalValue: (Number(affectionValue) / 2) * (employerValue / 100),
      time: 15,
      unitTime: "Dias",
    };
    await this.payrollGenerateRepository.createDeduction(
      deduction as IDeduction
    );
    return { deduction };
  }

  async calculateRetirementDeduction(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    parameter: IParameter[]
  ): Promise<object> {
    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeCyclicDeduction,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0,
        formPeriod.id
      );
    const employeeValue = Number(
      parameter.find((item) => item.id == "PCT_PENSION_EMPLEADO")?.value
    );
    const employerValue = Number(
      parameter.find((item) => item.id == "PCT_PENSION_PATRONAL")?.value
    );
    const deduction = {
      idTypePayroll: formPeriod.id,
      idEmployment: employment.id,
      idTypeDeduction: EDeductionTypes.retirementFund,
      value: (Number(affectionValue) / 2) * (employeeValue / 100),
      patronalValue: (Number(affectionValue) / 2) * (employerValue / 100),
      time: 15,
      unitTime: "Dias",
    };
    await this.payrollGenerateRepository.createDeduction(
      deduction as IDeduction
    );
    return { deduction };
  }

  async calculateSolidarityFund(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    smlv: number,
    solidarityFundTable: IRange[]
  ): Promise<object> {
    const affectionValue = employment.salaryHistories[0].salary;

    // si tiene dependiente le restamos segun el calculo

    // Si tiene Certificado Alivio tributario le resta

    const tableValue = Number(affectionValue) / smlv;

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
    return {
      value: Number(solidarityFundValueFixed),
      idEmployment: employment.id || 0,
      idTypePayroll: formPeriod.id || 0,
      idTypeDeduction: EDeductionTypes.solidarityFund,
      patronalValue: 0,
    };
  }

  async calculateEventualDeductions(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod
  ): Promise<object> {
    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeCyclicDeduction,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0,
        formPeriod.id
      );
    if (employment.id) {
      const eventualDeductions =
        await this.payrollGenerateRepository.getEventualDeductionsByEmployment(
          employment.id,
          formPeriod.id || 0
        );

      if (eventualDeductions.length == 0) {
        return {};
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
      return { deductions };
    }
    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
    return {};
  }

  async calculateCiclicalDeductions(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod
  ): Promise<object> {
    if (!employment.id) {
      // Si employment.id no existe, no podemos continuar, así que simplemente retornamos.
      return {};
    }

    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeCyclicDeduction,
        formPeriod.month,
        formPeriod.year,
        employment.id,
        formPeriod.id
      );

    if (affectionValue === 0) {
      // Si el valor de afectación es 0, no necesitamos continuar, así que retornamos.
      return {};
    }

    const ciclicalDeductions =
      await this.payrollGenerateRepository.getCyclicDeductionsByEmployment(
        employment.id
      );

    if (ciclicalDeductions.length === 0) {
      // Si no hay deducciones cíclicas, no necesitamos continuar, así que retornamos.
      return {};
    }

    const lastQuotaNumber = ciclicalDeductions.reduce(
      (maxQuotaNumber, ciclicalDeduction) => {
        const installments = ciclicalDeduction.installmentsDeduction || [];
        const lastInstallment = installments.reduce(
          (maxInstallment, installment) =>
            Math.max(maxInstallment, installment.quotaNumber),
          0
        );
        return Math.max(maxQuotaNumber, lastInstallment);
      },
      0
    );

    const deductions = ciclicalDeductions.map((ciclicalDeduction) => ({
      idTypePayroll: formPeriod.id,
      idDeductionManual: ciclicalDeduction.id,
      quotaNumber: lastQuotaNumber + 1,
      quotaValue: ciclicalDeduction.porcentualValue
        ? affectionValue * (Number(ciclicalDeduction.value) / 100)
        : ciclicalDeduction.value,
      applied: true,
    }));

    const deductionsCiclys = ciclicalDeductions.map((eventualDeduction) => ({
      value: eventualDeduction.porcentualValue
        ? (Number(eventualDeduction.value) / 100) * Number(affectionValue)
        : eventualDeduction.value,
      idEmployment: employment.id || 0,
      idTypePayroll: formPeriod.id || 0,
      idTypeDeduction: eventualDeduction.codDeductionType || 0,
      patronalValue: 0,
    }));

    await Promise.all([
      this.payrollGenerateRepository.createCiclycalInstallmentDeduction(
        deductions
      ),
      this.payrollGenerateRepository.createManyDeduction(deductionsCiclys),
    ]);
    return { deductions, deductionsCiclys };
    // 1. buscar licencias vigentes y que entren en planilla
    // 2. si no existen, retornar
    // 3. Calcular e insertar en la tabla final de Ingresos
  }

  async calculateDeductionRelatives(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    uvtValue: number
  ): Promise<object> {
    const relatives = await this.payrollGenerateRepository.getRelatives(
      employment.workerId ?? 0
    );

    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeTaxGrouper,
        formPeriod.month,
        formPeriod.year,
        employment.id ?? 0,
        formPeriod.id
      );

    if (relatives.length > 0) {
      const percent10AffectionValue = (affectionValue * 10) / 100;

      const uvt32 = uvtValue * 32;

      const valueDeduction =
        percent10AffectionValue > uvt32 ? uvt32 : percent10AffectionValue;

      this.payrollGenerateRepository.createDeduction({
        value: Number(valueDeduction),
        idEmployment: employment.id ?? 0,
        idTypePayroll: formPeriod.id ?? 0,
        idTypeDeduction: EDeductionTypes.dependentPeople,
        patronalValue: 0,
      });
      return {
        value: Number(valueDeduction),
        idEmployment: employment.id ?? 0,
        idTypePayroll: formPeriod.id ?? 0,
        idTypeDeduction: EDeductionTypes.dependentPeople,
        patronalValue: 0,
      };
    }
    return {};
  }

  async calculateISR(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    uvtValue: number,
    incomeTaxTable: IRange[]
  ): Promise<object> {
    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeTaxGrouper,
        formPeriod.month,
        formPeriod.year,
        employment.id ?? 0
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
    return {
      value: Number(isrValue),
      idEmployment: employment.id || 0,
      idTypePayroll: formPeriod.id || 0,
      idTypeDeduction: EDeductionTypes.incomeTax,
      patronalValue: 0,
    };
  }
}
