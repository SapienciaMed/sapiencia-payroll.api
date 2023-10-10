import {
  EGroupers,
  EDeductionTypes,
  EIncomeTypes,
  EReserveTypes,
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
import Income from "App/Models/Income";

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
  ): Promise<{ income: object; days: number }> {
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
    return { income, days: daysSalary };
    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
  }
  async calculateSalarycontractor(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    suspensionDays: number
  ) {
    const valueDay = salary / 30;
    let daysSalary = 0;
    if (employment.startDate < formPeriod.dateStart) {
      daysSalary += 30 - suspensionDays;
    } else {
      daysSalary +=
        Number(
          calculateDifferenceDays(employment.startDate, formPeriod.dateEnd)
        ) - suspensionDays;
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
    return { income, days: daysSalary };
    // 1. buscar liciencias vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
  }

  async calculateServiceBounty(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    percentageBounty: number,
    days: number
  ): Promise<Object> {
    const incomePrevious =
      await this.payrollGenerateRepository.getIncomeByTypeAndEmployment(
        employment.id ?? 0,
        formPeriod.idFormType
      );

    const periodDays = calculateDifferenceDays(employment.startDate);

    if (periodDays < 365 || !incomePrevious) {
      return {};
    }
    if(incomePrevious.length > 0){
      const lastIncomeDate = incomePrevious.sort((a, b) => b.id - a.id)[0]
      .formPeriod.dateStart;
      
      if (calculateDifferenceDays(lastIncomeDate) < 365) {
        return {};
      }
    }


    const bountyValue = salary * (percentageBounty / 100);

    const income = {
      idTypePayroll: formPeriod.id,
      idEmployment: employment.id,
      idTypeIncome: EIncomeTypes.serviceBonus,
      value: bountyValue,
      time: days,
      unitTime: "Dias",
    };

    await this.payrollGenerateRepository.createIncome(income as IIncome);

    return { income };
  }

  async calculateSeverancePayInterest(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    daysWorked: number,
    salary: number
  ): Promise<{ severancePayInterest: object; value: number }> {
    const serviceBounty =
      await this.payrollGenerateRepository.getLastServiceBonus(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.serviceBonus
      );
    const primaService =
      await this.payrollGenerateRepository.getLastPrimaService(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.primaService
      );
    const christmasBonus =
      await this.payrollGenerateRepository.getLastServiceBonus(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.primaChristmas
      );
    const vacationBonus =
      await this.payrollGenerateRepository.getLastPrimaService(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.primaVacations
      );
    //cesantías x12%
    //para calcular los intereses a la cesantías primero calculamos un subtotal con la siguiente fórmula: ((salario básico+ (última bonificación de servicio/12)+(última prima de servicio/12 )+(última prima de vacaciones/12)+(última prima de navidad/12))/360)*días a liquidar
    const reserveValueSubtotal =
      ((salary +
        serviceBounty.value / 12 +
        primaService.value / 12 +
        vacationBonus.value / 12 +
        christmasBonus.value / 12) /
        360) *
      daysWorked;
    const severancePayTotal =
      ((reserveValueSubtotal * 0.12) / 360) * daysWorked;
    this.payrollGenerateRepository.createIncome({
      idTypePayroll: formPeriod.id ?? 0,
      idEmployment: employment.id ?? 0,
      idTypeIncome: EIncomeTypes.serviceBonus,
      value: severancePayTotal,
      time: daysWorked,
      unitTime: "Dias",
    });
    return {
      severancePayInterest: {
        idTypePayroll: formPeriod.id,
        idEmployment: employment.id,
        idTypeIncome: EIncomeTypes.severancePayInterest,
        value: severancePayTotal,
        time: daysWorked,
        unitTime: "Dias",
      },
      value: severancePayTotal,
    };
  }
  async calculateHealthDeduction(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    parameter: IParameter[],
    time?: number,
    unitTime?: string
  ): Promise<object> {
    const employeeValue = Number(
      parameter.find((item) => item.id == "PCT_SEGURIDAD_SOCIAL_EMPLEADO")
        ?.value
    );
    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeCyclicDeduction,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0,
        formPeriod.id
      );
    const employerValue = Number(
      parameter.find((item) => item.id == "PCT_SEGURIDAD_SOCIAL_PATRONAL")
        ?.value
    );
    const deduction = {
      idTypePayroll: formPeriod.id,
      idEmployment: employment.id,
      idTypeDeduction: EDeductionTypes.SocialSecurity,
      value: Number(affectionValue) * (employeeValue / 100),
      patronalValue: Number(affectionValue) * (employerValue / 100),
      time: time ?? null,
      unitTime: unitTime ?? null,
    };
    await this.payrollGenerateRepository.createDeduction(
      deduction as IDeduction
    );
    return { ...deduction, ingreso: affectionValue };
  }

  async calculateRetirementDeduction(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    parameter: IParameter[],
    time?: number,
    unitTime?: string
  ): Promise<object> {
    const employeeValue = Number(
      parameter.find((item) => item.id == "PCT_PENSION_EMPLEADO")?.value ?? 4
    );
    const affectionValue =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeCyclicDeduction,
        formPeriod.month,
        formPeriod.year,
        employment.id || 0,
        formPeriod.id
      );
    const employerValue = Number(
      parameter.find((item) => item.id == "PCT_PENSION_PATRONAL")?.value ?? 12
    );
    const deduction = {
      idTypePayroll: formPeriod.id,
      idEmployment: employment.id,
      idTypeDeduction: EDeductionTypes.retirementFund,
      value: Number(affectionValue) * (employeeValue / 100),
      patronalValue: Number(affectionValue) * (employerValue / 100),
      time: time ?? null,
      unitTime: unitTime ?? null,
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
      (i) => tableValue >= i.start && tableValue <= i.end
    );

    if (!range) {
      throw new Error("Tabla de la renta no encontrada");
    }

    const solidarityFundValue = range.value / 100;

    const solidarityFundValueFixed = (
      solidarityFundValue * Number(affectionValue)
    ).toFixed(2);

    await this.payrollGenerateRepository.createDeduction({
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
  async calculateSuspension(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod
  ): Promise<{ income?: object; number: number }> {
    let suspensionDays = 0;

    if (employment.id) {
      const suspensions =
        await this.payrollGenerateRepository.getSuspensionPeriodByEmployment(
          employment.id,
          formPeriod.dateStart,
          formPeriod.dateEnd
        );

      if (suspensions.length == 0) {
        return { number: Number(suspensionDays) ?? 0 };
      }

      for (const suspension of suspensions) {
        suspensionDays += calculateDifferenceDays(
          suspension.dateStart,
          suspension.dateEnd
        );
      }

      const income = {
        idTypePayroll: formPeriod.id,
        idEmployment: employment.id,
        idTypeIncome: EIncomeTypes.license,
        value: 0,
        time: suspensionDays,
        unitTime: "Dias",
      };
      // await this.payrollGenerateRepository.createIncome(income as IIncome);

      return {
        income,
        number: Number(suspensionDays) ?? 0,
      };
    }
    // 1. buscar suspensiones vigentes y que entren en planilla
    // 2. si no exitiste return
    // 3. Calcula e inserta en la tabla final de Ingresos
    return { number: Number(suspensionDays) ?? 0 };
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
              (Number(eventualDeduction.value) / 100) * Number(affectionValue),
            idEmployment: employment.id || 0,
            idTypePayroll: formPeriod.id || 0,
            idTypeDeduction: eventualDeduction.codDeductionType || 0,
            patronalValue: 0,
          };
        } else {
          return {
            value: eventualDeduction.value,
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
      (i) => tableValue >= i.start && tableValue <= i.end
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
  //Calculamos el valor de la Bonificación de servicios de la siguiente manera : ((sueldo básico x 35%)/360) x nro de días trabajos en el mes
  async calculateReserveServiceBounty(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    daysWorked: number
  ): Promise<{ serviceBounty: object; value: number }> {
    const reserveValue = ((salary * 0.35) / 360) * daysWorked;
    this.payrollGenerateRepository.createReserve({
      idTypePayroll: formPeriod.id || 0,
      idEmployment: employment.id || 0,
      idTypeReserve: EReserveTypes.bountyService,
      value: reserveValue,
      time: daysWorked,
      unitTime: "Dias",
    });
    return {
      serviceBounty: {
        idTypePayroll: formPeriod.id || 0,
        idEmployment: employment.id || 0,
        idTypeReserve: EReserveTypes.bountyService,
        value: reserveValue,
        time: daysWorked,
        unitTime: "Dias",
      },
      value: reserveValue,
    };
  }
  async calculateReserveServiceBonus(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    daysWorked: number,
    bonusService: number
  ): Promise<{ serviceBonus: object; value: number }> {
    //(((salario básico/360)* días trabajados)+ (bonificación de servicio/12))/2
    const reserveValue = ((salary / 360) * daysWorked + bonusService / 12) / 2;
    this.payrollGenerateRepository.createReserve({
      idTypePayroll: formPeriod.id || 0,
      idEmployment: employment.id || 0,
      idTypeReserve: EReserveTypes.bonusService,
      value: reserveValue,
      time: daysWorked,
      unitTime: "Dias",
    });
    return {
      serviceBonus: {
        idTypePayroll: formPeriod.id || 0,
        idEmployment: employment.id || 0,
        idTypeReserve: EReserveTypes.bonusService,
        value: reserveValue,
        time: daysWorked,
        unitTime: "Dias",
      },
      value: reserveValue,
    };
  }

  async calculateReserveRecreationBounty(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    daysWorked: number
  ): Promise<{ recreationBounty: object; value: number }> {
    //(((salario básico/30)*2) /360)*días trabajados
    const reserveValue = (((salary / 30) * 2) / 360) * daysWorked;
    this.payrollGenerateRepository.createReserve({
      idTypePayroll: formPeriod.id || 0,
      idEmployment: employment.id || 0,
      idTypeReserve: EReserveTypes.bountyRecreation,
      value: reserveValue,
      time: daysWorked,
      unitTime: "Dias",
    });
    return {
      recreationBounty: {
        idTypePayroll: formPeriod.id || 0,
        idEmployment: employment.id || 0,
        idTypeReserve: EReserveTypes.bountyRecreation,
        value: reserveValue,
        time: daysWorked,
        unitTime: "Dias",
      },
      value: reserveValue,
    };
  }

  async calculateReserveVacationReserve(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    daysWorked: number,
    bountyService: number,
    bonusService: number
  ): Promise<{ vacationReserve: object; value: number }> {
    //((((salario básico/360)* días trabajados)+ (bonificación de servicio/12)+(prima de servicio/12 ))/2
    const reserveValue =
      ((salary / 360) * daysWorked + bountyService / 12 + bonusService / 12) /
      2;
    this.payrollGenerateRepository.createReserve({
      idTypePayroll: formPeriod.id || 0,
      idEmployment: employment.id || 0,
      idTypeReserve: EReserveTypes.vacation,
      value: reserveValue,
      time: daysWorked,
      unitTime: "Dias",
    });
    return {
      vacationReserve: {
        idTypePayroll: formPeriod.id || 0,
        idEmployment: employment.id || 0,
        idTypeReserve: EReserveTypes.vacation,
        value: reserveValue,
        time: daysWorked,
        unitTime: "Dias",
      },
      value: reserveValue,
    };
  }

  async calculateReserveVacationBonus(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    daysWorked: number,
    bountyService: number,
    bonusService: number
  ): Promise<{ bonusVacation: object; value: number }> {
    //((((salario básico/360)* días trabajados)+ (bonificación de servicio/12)+(prima de servicio/12 ))/2
    const reserveValue =
      ((salary / 360) * daysWorked + bountyService / 12 + bonusService / 12) /
      2;
    this.payrollGenerateRepository.createReserve({
      idTypePayroll: formPeriod.id || 0,
      idEmployment: employment.id || 0,
      idTypeReserve: EReserveTypes.bonusVacation,
      value: reserveValue,
      time: daysWorked,
      unitTime: "Dias",
    });
    return {
      bonusVacation: {
        idTypePayroll: formPeriod.id || 0,
        idEmployment: employment.id || 0,
        idTypeReserve: EReserveTypes.bonusVacation,
        value: reserveValue,
        time: daysWorked,
        unitTime: "Dias",
      },
      value: reserveValue,
    };
  }
  async calculateReserveChristmasBonus(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    daysWorked: number,
    bountyService: number,
    bonusService: number,
    vacationBonus: number
  ): Promise<{ christmasBonus: object; value: number }> {
    //(((salario básico/360)* días trabajados)+ (bonificación de servicio/12)+(prima de servicio/12 )+(prima de vacaciones/12))
    const reserveValue =
      (salary / 360) * daysWorked +
      bountyService / 12 +
      bonusService / 12 +
      vacationBonus / 12;
    this.payrollGenerateRepository.createReserve({
      idTypePayroll: formPeriod.id || 0,
      idEmployment: employment.id || 0,
      idTypeReserve: EReserveTypes.bonusChristmas,
      value: reserveValue,
      time: daysWorked,
      unitTime: "Dias",
    });
    return {
      christmasBonus: {
        idTypePayroll: formPeriod.id || 0,
        idEmployment: employment.id || 0,
        idTypeReserve: EReserveTypes.bonusChristmas,
        value: reserveValue,
        time: daysWorked,
        unitTime: "Dias",
      },
      value: reserveValue,
    };
  }
  async calculateReserveSeverancePay(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    daysWorked: number,
    bountyService: number,
    bonusService: number,
    vacationBonus: number,
    christmasBonus: number
  ): Promise<{ severancePay: object; value: number }> {
    //(((salario básico/360)* días trabajados)+ (bonificación de servicio/12)+(prima de servicio/12 )+(prima de vacaciones/12)+(prima de navidad/12)))
    const salary = Number(employment.salaryHistories[0].salary);
    const reserveValue =
      (salary / 360) * daysWorked +
      bountyService / 12 +
      bonusService / 12 +
      vacationBonus / 12 +
      christmasBonus / 12;
    this.payrollGenerateRepository.createReserve({
      idTypePayroll: formPeriod.id || 0,
      idEmployment: employment.id || 0,
      idTypeReserve: EReserveTypes.severancePay,
      value: reserveValue,
      time: daysWorked,
      unitTime: "Dias",
    });
    return {
      severancePay: {
        idTypePayroll: formPeriod.id || 0,
        idEmployment: employment.id || 0,
        idTypeReserve: EReserveTypes.severancePay,
        value: reserveValue,
        time: daysWorked,
        unitTime: "Dias",
      },
      value: reserveValue,
    };
  }
  async calculateReserveSeverancePayInterest(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    severancePay: number,
    daysWorked: number
  ): Promise<{ severancePayInterest: object; value: number }> {
    //cesantías x12%
    const reserveValue = severancePay * 0.12;
    this.payrollGenerateRepository.createReserve({
      idTypePayroll: formPeriod.id || 0,
      idEmployment: employment.id || 0,
      idTypeReserve: EReserveTypes.severancePayInterest,
      value: reserveValue,
      time: daysWorked,
      unitTime: "Dias",
    });
    return {
      severancePayInterest: {
        idTypePayroll: formPeriod.id || 0,
        idEmployment: employment.id || 0,
        idTypeReserve: EReserveTypes.severancePayInterest,
        value: reserveValue,
        time: daysWorked,
        unitTime: "Dias",
      },
      value: reserveValue,
    };
  }

  async calculateHistoricalPayroll(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    daysWorked: number,
    salary: number,
    state: string,
    error?: string
  ): Promise<void> {
    const incomes =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.incomeCyclicDeduction,
        formPeriod.month,
        formPeriod.year,
        employment.id ?? 0
      );
    const deductions =
      await this.payrollGenerateRepository.getMonthlyValuePerGrouper(
        EGroupers.totalDeductions,
        formPeriod.month,
        formPeriod.year,
        employment.id ?? 0
      );
    this.payrollGenerateRepository.createHistoricalPayroll({
      idTypePayroll: formPeriod.id || 0,
      idEmployment: employment.id || 0,
      workedDay: daysWorked,
      salary: salary,
      totalIncome: incomes,
      totalDeduction: deductions,
      total: Number(incomes) + Number(deductions),
      state: state,
      observation: error ?? "",
    });
  }

  async calculateVacationsBonus(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number,
    vacationDays: number
  ): Promise<IIncome[]> {
    const lastServiceBonus =
      await this.payrollGenerateRepository.getLastIncomeType(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.serviceBonus
      );

    const lastPrimaService =
      await this.payrollGenerateRepository.getLastIncomeType(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.primaService
      );

    const calculatedVacations =
      ((salary + lastServiceBonus.value / 12 + lastPrimaService.value / 12) /
        360) *
      vacationDays;

    const calculatedPrimaVacations =
      ((salary + lastServiceBonus.value / 12 + lastPrimaService.value / 12) /
        360) *
      180;

    const calculatedBonusRecreation = (salary / 30) * 2;

    const createdIncomesVacations = [
      {
        idTypePayroll: formPeriod.id ?? 0,
        idEmployment: employment.id ?? 0,
        idTypeIncome: EIncomeTypes.vacation,
        value: Math.round(calculatedVacations),
      },
      {
        idTypePayroll: formPeriod.id ?? 0,
        idEmployment: employment.id ?? 0,
        idTypeIncome: EIncomeTypes.primaVacations,
        value: Math.round(calculatedPrimaVacations),
      },
      {
        idTypePayroll: formPeriod.id ?? 0,
        idEmployment: employment.id ?? 0,
        idTypeIncome: EIncomeTypes.bonusRecreation,
        value: Math.round(calculatedBonusRecreation),
      },
    ] as Income[];

    const vacationsBonus =
      await this.payrollGenerateRepository.createManyIncome(
        createdIncomesVacations
      );

    return vacationsBonus;
  }

  async calculatePrimaServices(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number
  ): Promise<IIncome> {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const dateVinculation = new Date(String(employment.startDate));

    const oneJulyPreviusYear = new Date(previousYear, 6, 1);

    const lastServiceBonus =
      await this.payrollGenerateRepository.getLastIncomeType(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.serviceBonus
      );

    if (dateVinculation > oneJulyPreviusYear) {
      const daysLiquidate = calculateDifferenceDays(
        dateVinculation,
        new Date(currentYear, 5, 30)
      );

      const calculatePrimaService =
        (salary + lastServiceBonus.value / 12 / 720) * daysLiquidate;

      const primaService = await this.payrollGenerateRepository.createIncome({
        idTypePayroll: formPeriod.id ?? 0,
        idEmployment: employment.id ?? 0,
        idTypeIncome: EIncomeTypes.incapacity,
        value: Math.round(calculatePrimaService),
        time: daysLiquidate,
        unitTime: "Dias",
      });

      return primaService;
    } else {
      const calculatePrimaService =
        (salary + lastServiceBonus.value / 12 / 720) * 360;

      const primaService = await this.payrollGenerateRepository.createIncome({
        idTypePayroll: formPeriod.id ?? 0,
        idEmployment: employment.id ?? 0,
        idTypeIncome: EIncomeTypes.incapacity,
        value: Math.round(calculatePrimaService),
        time: 360,
        unitTime: "Dias",
      });

      return primaService;
    }
  }

  async calculatePrimaChristmas(
    employment: IEmploymentResult,
    formPeriod: IFormPeriod,
    salary: number
  ): Promise<IIncome> {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const dateVinculation = new Date(String(employment.startDate));

    const oneDecemberPreviusYear = new Date(previousYear, 11, 1);

    const lastServiceBonus =
      await this.payrollGenerateRepository.getLastIncomeType(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.serviceBonus
      );

    const lastPrimaService =
      await this.payrollGenerateRepository.getLastIncomeType(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.primaService
      );

    const lastPrimaVacations =
      await this.payrollGenerateRepository.getLastIncomeType(
        formPeriod.id ?? 0,
        employment.id ?? 0,
        EIncomeTypes.primaVacations
      );

    if (dateVinculation > oneDecemberPreviusYear) {
      const daysLiquidate = calculateDifferenceDays(
        dateVinculation,
        new Date(currentYear, 10, 30)
      );

      const calculatePrimaChristmas =
        ((salary +
          lastServiceBonus.value / 12 +
          lastPrimaService.value / 12 +
          lastPrimaVacations.value / 12) /
          360) *
        daysLiquidate;

      const primaService = await this.payrollGenerateRepository.createIncome({
        idTypePayroll: formPeriod.id ?? 0,
        idEmployment: employment.id ?? 0,
        idTypeIncome: EIncomeTypes.incapacity,
        value: Math.round(calculatePrimaChristmas),
        time: daysLiquidate,
        unitTime: "Dias",
      });

      return primaService;
    } else {
      const calculatePrimaChristmas =
        ((salary +
          lastServiceBonus.value / 12 +
          lastPrimaService.value / 12 +
          lastPrimaVacations.value / 12) /
          360) *
        360;

      const primaService = await this.payrollGenerateRepository.createIncome({
        idTypePayroll: formPeriod.id ?? 0,
        idEmployment: employment.id ?? 0,
        idTypeIncome: EIncomeTypes.incapacity,
        value: Math.round(calculatePrimaChristmas),
        time: 360,
        unitTime: "Dias",
      });

      return primaService;
    }
  }
}
