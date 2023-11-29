import fsPromises from "fs/promises";
import path from "path";
import { numberToColombianPesosWord } from "@isildur1/number-to-word";

import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IReportsRepository } from "App/Repositories/ReportsRepository";
import {
  IDetailColillaPDF,
  IReport,
  IReportResponse,
} from "App/Interfaces/ReportInterfaces";
import { IIncome } from "App/Interfaces/IncomeInterfaces";
import { IDeduction } from "App/Interfaces/DeductionsInterfaces";

import { ETypeReport } from "App/Constants/Report.Enum";
import {
  EDeductionTypes,
  EIncomeTypes,
} from "App/Constants/PayrollGenerateEnum";
import { EIncomeType } from "App/Constants/OtherIncome.enum";

import CoreService from "./External/CoreService";

import { formaterNumberToCurrency } from "../Utils/functions";
import { AdministrativeActReport } from "App/Repositories/components-word/AdministrativeActReport";
import { ProofOfContracts } from "App/Repositories/components-word/ProofOfContracts";
import { VacationResolution } from "App/Repositories/components-word/VacationResolutionReport";
import { IWorkerRepository } from "App/Repositories/WorkerRepository";

export interface IReportService {
  payrollDownloadById(id: number): Promise<ApiResponse<any>>;
  generateWordReport(): Promise<ApiResponse<any>>;
  generateReport(report: IReport): Promise<ApiResponse<IReportResponse>>;
}

export default class ReportService implements IReportService {
  constructor(
    public reportRepository: IReportsRepository,
    public coreService: CoreService
  ) { }

  async generateWordReport(): Promise<ApiResponse<any>> {

    let noReport = 2;
    let report;
    let result;
    let data;
    if (noReport == 1) {
      const administrativeActReport = new AdministrativeActReport();
      data = await this.reportRepository.getPayrollInformationLiquidationYear(2023, 20)
      const dataReport = this.structureDataAdministrativeActReport(data);
      report = await administrativeActReport.generateReport(dataReport);
    }
    if (noReport == 2) {
      data = await this.reportRepository.getPayrollInformationContractsYear(2023, 25)
      const dataReport = this.structureDataProofOfContractsReport(data);
      const proofOfContracts = new ProofOfContracts();
      report = await proofOfContracts.generateReport(dataReport);
    }
    if (noReport == 3) {
      const vacationResolution = new VacationResolution();
      report = await vacationResolution.generateReport();
    }
    result = this.reportRepository.generateWordReport(report);
    return data;
  }

  async payrollDownloadById(id: number): Promise<ApiResponse<any>> {
    const toSend: any[] = [];
    const incomeTypeList = await this.reportRepository.getAllIncomesTypes();
    const deductionsTypeList =
      await this.reportRepository.getAllDeductionsTypes();
    const reserveTypeList = await this.reportRepository.getAllReservesTypes();
    const formPeriod = await this.reportRepository.getPayrollInformation(id);

    if (!formPeriod || !formPeriod.historicalPayroll || !formPeriod.incomes) {
      return new ApiResponse(
        false,
        EResponseCodes.FAIL,
        "Recurso no encontrado"
      );
    }

    const incomeTypeToShow = incomeTypeList.filter((type) =>
      formPeriod.incomes?.find((i) => i.idTypeIncome === type.id)
    );

    const deductionTypeToShow = deductionsTypeList.filter((type) =>
      formPeriod.deductions?.find((i) => i.idTypeDeduction === type.id)
    );

    const patronalDeductionTypeToShow = deductionsTypeList.filter((type) =>
      formPeriod.deductions?.find(
        (i) => i.idTypeDeduction === type.id && i.patronalValue > 0
      )
    );

    const reserveTypeToShow = reserveTypeList.filter((type) =>
      formPeriod.reserves?.find((i) => i.idTypeReserve === type.id)
    );

    // nombres.forEach(nombre => {
    //   nombresObjeto[nombre] = true;
    // });

    for (const historical of formPeriod.historicalPayroll) {
      let temp = {
        Nombre: `${historical.employment?.worker?.firstName} ${historical.employment?.worker?.secondName ?? ""
          } ${historical.employment?.worker?.surname} ${historical.employment?.worker?.secondSurname
          }`,
        Identificación: historical.employment?.worker?.numberDocument,
        "Código fiscal": historical.employment?.worker?.fiscalIdentification,
        "Nro. Contrato": historical.employment?.contractNumber,
        "Cuenta bancaria": historical.employment?.worker?.accountBankNumber,
        Banco: historical.employment?.worker?.bank,
        "Inicio periodo": formPeriod.dateStart,
        "Fin periodo": formPeriod.dateEnd,
        "Días Trabajados": historical.workedDay,
        "Salario Base": historical.salary,
        "Total ingresos": historical.totalIncome,
        "Total deducciones": historical.totalDeduction,
        Total: historical.total,
      };

      incomeTypeToShow.forEach((iType) => {
        const income = formPeriod.incomes?.find(
          (income) =>
            income.idTypeIncome == iType.id &&
            income.idEmployment == historical.idEmployment
        );

        temp[iType.name] = income ? income.value : 0;
      });

      deductionTypeToShow.forEach((iType) => {
        const deduction = formPeriod.deductions?.find(
          (deduction) =>
            deduction.idTypeDeduction == iType.id &&
            deduction.idEmployment == historical.idEmployment
        );

        temp[iType.name] = deduction ? deduction.value : 0;
      });

      patronalDeductionTypeToShow.forEach((iType) => {
        const deduction = formPeriod.deductions?.find(
          (deduction) =>
            deduction.idTypeDeduction == iType.id &&
            deduction.idEmployment == historical.idEmployment
        );

        temp[`${iType.name} patronal`] = deduction
          ? deduction.patronalValue
          : 0;
      });

      reserveTypeToShow.forEach((iType) => {
        const reserve = formPeriod.reserves?.find(
          (reserve) =>
            reserve.idTypeReserve == iType.id &&
            reserve.idEmployment == historical.idEmployment
        );

        temp[`${iType.name} reserva`] = reserve ? reserve.value : 0;
      });
      toSend.push(temp);
    }

    console.log(toSend);
    const result = this.reportRepository.generateXlsx(toSend);
    return result;
  }

  async generateReport(report: IReport): Promise<ApiResponse<IReportResponse>> {
    const response = {} as IReportResponse;

    const parameters = await this.coreService.getParametersByCodes([
      "NIT",
      "RAZON_SOCIAL_REPORTES",
      "COD_TIPO_DOCUMENTO",
      "COD_DEPARTAMENTO",
      "COD_CIUDAD",
      "CIUDAD_REP",
    ]);

    const nit = Number(parameters.find((i) => i.id == "NIT")?.value ?? 0);

    const socialReason =
      parameters.find((i) => i.id == "RAZON_SOCIAL_REPORTES")?.value ?? "";

    const codeTypeDocument =
      parameters.find((i) => i.id == "COD_TIPO_DOCUMENTO")?.value ?? "";

    const codeDeparment =
      parameters.find((i) => i.id == "COD_DEPARTAMENTO")?.value ?? "";

    const codeCity = parameters.find((i) => i.id == "COD_CIUDAD")?.value ?? "";

    const city = parameters.find((i) => i.id == "CIUDAD_REP")?.value ?? "";

    if (report.typeReport === ETypeReport.Colilla) {
      const reportInformationColilla =
        await this.reportRepository.getPayrollInformationEmployment(
          Number(report.period),
          report.codEmployment
        );

      const numberDocument =
        reportInformationColilla?.historicalPayroll?.[0].employment?.worker
          ?.numberDocument ?? "Sin documento";

      const nombreBanco =
        reportInformationColilla?.historicalPayroll?.[0].employment?.worker
          ?.bank;

      const numeroCuentaBanco =
        reportInformationColilla?.historicalPayroll?.[0].employment?.worker
          ?.accountBankNumber;

      const fullName = `${reportInformationColilla?.historicalPayroll?.[0].employment?.worker?.firstName} ${reportInformationColilla?.historicalPayroll?.[0].employment?.worker?.secondName} ${reportInformationColilla?.historicalPayroll?.[0].employment?.worker?.firstName} ${reportInformationColilla?.historicalPayroll?.[0].employment?.worker?.secondSurname}`;

      const salaryBasic =
        reportInformationColilla?.historicalPayroll?.[0].employment?.charge
          ?.baseSalary ?? "";

      const charge =
        reportInformationColilla?.historicalPayroll?.[0]?.employment?.charge
          ?.name ?? "";

      const dependence =
        reportInformationColilla?.historicalPayroll?.[0]?.employment?.dependence
          ?.name ?? "";

      const arrIncomeAndDeductions = [
        ...(reportInformationColilla?.incomes ?? []),
        ...(reportInformationColilla?.deductions ?? []),
      ];

      const arrIncomeAndDeductionsFormated = arrIncomeAndDeductions.map(
        (i: IIncome | IDeduction) => {
          let objectReturn = {} as IDetailColillaPDF;

          if ("incomeType" in i) {
            objectReturn.name = i.incomeType?.name ?? "No hay detalle";
            objectReturn.type = "Income";
          } else if ("deductionTypeOne" in i) {
            objectReturn.name = i.deductionTypeOne?.name ?? "No hay detalle";
            objectReturn.type = "Deduction";
          }

          objectReturn.value = formaterNumberToCurrency(i.value);
          objectReturn.days = String(i.time ?? "0");

          return objectReturn;
        }
      );

      const totalIncomes = reportInformationColilla?.incomes?.reduce(
        (sum, i) => sum + Number(i.value),
        0
      );

      const totalDeductions = reportInformationColilla?.deductions?.reduce(
        (sum, i) => sum + Number(i.value),
        0
      );

      const restaIncomesDeductions =
        (totalIncomes ?? 0) - (totalDeductions ?? 0);

      const textRestIncomesDeductions = numberToColombianPesosWord(
        restaIncomesDeductions
      );

      const data = {
        consecutivo: report.period,
        logoSapiencia: await fsPromises.readFile(
          path.join(
            process.cwd(),
            "app",
            "resources",
            "img",
            "logoSapiencia.png"
          ),
          "base64"
        ),
        nit,
        fechaInicio: reportInformationColilla?.dateStart,
        fechaFin: reportInformationColilla?.dateEnd,
        numeroDocument: numberDocument,
        nombreCompleto: fullName,
        nombreBanco,
        numeroCuentaBanco,
        sueldoBasico: formaterNumberToCurrency(salaryBasic),
        cargo: charge,
        dependencia: dependence,
        arrIncomeAndDeductionsFormated,
        totalIncomes: formaterNumberToCurrency(totalIncomes),
        totalDeductions: formaterNumberToCurrency(totalDeductions),
        restaIncomesDeductions: formaterNumberToCurrency(
          restaIncomesDeductions
        ),
        textRestIncomesDeductions,
      };

      const bufferPDF = await this.reportRepository.generatePdf(
        "colilla.hbs",
        data,
        true,
        "colilla.css"
      );

      response.bufferFile = bufferPDF;
      response.nameFile = "colilla.pdf";

      return new ApiResponse(response, EResponseCodes.OK);
    }

    if (report.typeReport === ETypeReport.CertificadoIngresosRetenciones) {
      const reportInformation =
        await this.reportRepository.getPayrollInformationYear(
          Number(report.period),
          Number(report.codEmployment)
        );

      const relevantIncomeTypes = [
        EIncomeTypes.salary,
        EIncomeTypes.bonusRecreation,
        EIncomeTypes.serviceBonus,
        EIncomeTypes.primaVacations,
        EIncomeTypes.license,
        EIncomeTypes.incapacity,
      ];
      let paidsSalary = 0;
      let paidsFee = 0;
      let paidsSocialBenefits = 0;
      let paidsOtherIncomes = 0;
      let totalSeverancePaids = 0;
      let severancePaid = 0;
      let totalIncomes = 0;
      let pensionSolidarityPaid = 0;
      let healthPaid = 0;
      let voluntaryPensionPaid = 0;
      let AfpPaid = 0;
      let incometaxPaid = 0;
      let firstName =
        reportInformation?.[0]?.historicalPayroll?.[0]?.employment?.worker
          ?.firstName ?? "";
      let document =
        reportInformation?.[0]?.historicalPayroll?.[0]?.employment?.worker
          ?.numberDocument ?? "";
      let secondName =
        reportInformation?.[0]?.historicalPayroll?.[0]?.employment?.worker
          ?.secondName ?? "";
      let surName =
        reportInformation?.[0]?.historicalPayroll?.[0]?.employment?.worker
          ?.surname ?? "";
      let secondSurname =
        reportInformation?.[0]?.historicalPayroll?.[0]?.employment?.worker
          ?.secondSurname ?? "";
      const dependent =
        reportInformation?.[0]?.historicalPayroll?.[0]?.employment?.worker?.relatives?.filter(
          (dependent) => {
            dependent.dependent;
          }
        ) ?? [];
      let nameDependent = "";
      let relationDependent = "";
      if (dependent.length > 0) {
        dependent[0].name ?? "";
        const relationshipMapping = {
          "1": "Espos@",
          "2": "Hij@",
          "3": "Hijastr@",
        };

        relationDependent =
          relationshipMapping[dependent[0].relationship] ?? "";
      }

      let startDate =
        new Date().getFullYear() === Number(report.period)
          ? `01/01/${new Date().getFullYear()}`
          : `01/01/${report.period}`;
      let endDate =
        new Date().getFullYear() === Number(report.period)
          ? `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
          : `31/12/${report.period}`;
      let expeditionDate = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;

      reportInformation?.map((info) => {
        paidsSalary =
          info.incomes?.reduce(
            (sum, i) =>
              relevantIncomeTypes.includes(i.idTypeIncome)
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;
        paidsSocialBenefits =
          info.incomes?.reduce(
            (sum, i) =>
              i.idTypeIncome === EIncomeTypes.primaService ||
                i.idTypeIncome === EIncomeTypes.vacation
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;
        paidsOtherIncomes =
          info.incomes?.reduce(
            (sum, i) =>
              i.idTypeIncome === EIncomeType.ApoyoEstudiantil ||
                i.idTypeIncome === EIncomeType.AprovechamientoTiempoLibre
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;
        totalSeverancePaids =
          info.incomes?.reduce(
            (sum, i) =>
              i.idTypeIncome === EIncomeTypes.severancePay ||
                i.idTypeIncome === EIncomeTypes.severancePayInterest
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;

        severancePaid =
          info.incomes?.reduce(
            (sum, i) =>
              i.idTypeIncome === EIncomeTypes.severancePay
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;

        totalIncomes =
          Number(paidsSalary ?? 0) +
          Number(paidsSocialBenefits ?? 0) +
          Number(paidsOtherIncomes ?? 0) +
          Number(totalSeverancePaids ?? 0) +
          Number(severancePaid ?? 0);

        healthPaid =
          info.deductions?.reduce(
            (sum, i) =>
              i.idTypeDeduction === EDeductionTypes.SocialSecurity
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;

        pensionSolidarityPaid =
          info.deductions?.reduce(
            (sum, i) =>
              i.idTypeDeduction === EDeductionTypes.retirementFund ||
                i.idTypeDeduction === EDeductionTypes.solidarityFund
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;

        voluntaryPensionPaid =
          info.deductions?.reduce(
            (sum, i) =>
              i.idTypeDeduction ===
                EDeductionTypes.voluntaryPensionContributions
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;

        AfpPaid =
          info.deductions?.reduce(
            (sum, i) =>
              i.idTypeDeduction === EDeductionTypes.contributionsAFC
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;
        incometaxPaid =
          info.deductions?.reduce(
            (sum, i) =>
              i.idTypeDeduction === EDeductionTypes.incomeTax
                ? Number(sum) + Number(i.value)
                : Number(sum),
            0
          ) ?? 0;
      });

      if (
        reportInformation?.[0]?.historicalPayroll?.[0]?.employment
          ?.typesContracts?.[0].temporary
      ) {
        paidsFee = paidsSalary;
        paidsSalary = 0;
      }
      const data = {
        logoDian: await fsPromises.readFile(
          path.join(process.cwd(), "app", "resources", "img", "logoDian.jpeg"),
          "base64"
        ),
        logo220: await fsPromises.readFile(
          path.join(process.cwd(), "app", "resources", "img", "220Dian.jpeg"),
          "base64"
        ),
        paidsSalary,
        paidsFee,
        paidsSocialBenefits,
        paidsOtherIncomes,
        totalSeverancePaids,
        severancePaid,
        totalIncomes,
        pensionSolidarityPaid,
        healthPaid,
        voluntaryPensionPaid,
        AfpPaid,
        incometaxPaid,
        document,
        firstName,
        secondName,
        surName,
        secondSurname,
        nameDependent,
        relationDependent,
        nit,
        socialReason,
        codeTypeDocument,
        codeDeparment,
        codeCity,
        city,
        startDate,
        endDate,
        expeditionDate,
      };

      const bufferPDF = await this.reportRepository.generatePdf(
        "retencionFuente.hbs",
        data,
        true,
        "retencion.css"
      );

      response.bufferFile = bufferPDF;
      response.nameFile = "retencion.pdf";

      return new ApiResponse(response, EResponseCodes.OK);
    }

    return new ApiResponse(response, EResponseCodes.OK);
  }


  // Estructuración de datos para generar reporte en word

  structureDataAdministrativeActReport = (data: any) => {
    const { total: totalValueInNumberToPay, salary } = data[0].historicalPayroll[0];

    const cesantiasData = data[0].incomes.filter(e => e.idTypeIncome === EIncomeTypes.severancePay);
    const cesantiasDataAccumulative = cesantiasData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { time: daysCesantias, value: cesantias } = cesantiasDataAccumulative;

    const interestCesantiasData = data[0].incomes.filter(e => e.idTypeIncome === EIncomeTypes.severancePayInterest);
    const interesCesantiasDataAccumulative = interestCesantiasData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { time: daysInterestSeverancePay, value: interestCesantias } = interesCesantiasDataAccumulative;

    const premiumChristmasDaysData = data[0].incomes.filter(e => e.idTypeIncome === EIncomeTypes.primaChristmas);
    const premiumChristmasDaysDataAccumulative = premiumChristmasDaysData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { time: premiumChristmasDays } = premiumChristmasDaysDataAccumulative;


    const vacationDaysAndVacationBonusData = data[0].incomes.filter(e => e.idTypeIncome === EIncomeTypes.primaVacations);
    const vacationDaysAndVacationBonusDataAccumulative = vacationDaysAndVacationBonusData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { time: vacationDaysAndVacationBonus } = vacationDaysAndVacationBonusDataAccumulative;

    const vacationsData = data[0].incomes.filter(e => e.idTypeIncome === EIncomeTypes.vacation);
    const vacationsDataAccumulative = vacationsData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { value: vacations } = vacationsDataAccumulative;


    const bonusServicesData = data[0].incomes.filter(e => e.idTypeIncome === EIncomeTypes.serviceBonus);
    const bonusServicesDataAccumulative = bonusServicesData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { time: daysBonusServices, value: serviceBonus } = bonusServicesDataAccumulative;



    const premiumServiceData = data[0].incomes.filter(e => e.idTypeIncome === EIncomeTypes.primaService);
    const premiumServiceDataAccumulative = premiumServiceData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { time: daysPremiumService, value: premiunService } = premiumServiceDataAccumulative;



    const recreationBonusData = data[0].incomes.filter(e => e.idTypeIncome === EIncomeTypes.bonusRecreation);
    const recreationBonusDataAccumulative = recreationBonusData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { value: recreationBonus } = recreationBonusDataAccumulative;
    
    
    const socialSecurityData = data[0].deductions.filter(e => e.idTypeDeduction === EDeductionTypes.SocialSecurity || e.idTypeDeduction === EDeductionTypes.retirementFund);
    const socialSecurityDataAccumulative = socialSecurityData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { value: socialSecurityContributions } = socialSecurityDataAccumulative;
    
    const contributionsAFCData = data[0].deductions.filter(e => e.idTypeDeduction === EDeductionTypes.contributionsAFC);
    const contributionsAFCDataAccumulative = contributionsAFCData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { value: contributionsAFC } = contributionsAFCDataAccumulative;
    
    const retentionSourceIncomeData = data[0].deductions.filter(e => e.idTypeDeduction === EDeductionTypes.incomeTax);
    const retentionSourceIncomeDataAccumulative = retentionSourceIncomeData.reduce(function (result, element) {
      result.value += parseFloat(element.value);
      result.time += element.time;
      return result;
    }, { value: 0, time: 0 });
    const { value: retentionSourceIncome } = retentionSourceIncomeDataAccumulative;

    const { worker, startDate: initialDateContract, endDate: finalDateContract, charge, dependence, typesContracts, observation } = data[0].historicalPayroll[0].employment
    const { name: chargeName, } = charge;
    const { name: dependenceName, } = dependence;
    const { name: linkageType } = typesContracts;
    const { gender, typeDocument, numberDocument, firstName, secondName, surname, secondSurname } = worker;

    const apelative = gender == 'H' ? "El señor" : gender == 'M' ? "La señora" : "l@ señor@";
    const server = gender == 'H' ? "El servidor" : gender == 'M' ? "La servidora" : "l@ servidor@";
    const completeName = `${firstName} ${secondName} ${surname} ${secondSurname}`

    
    let dataReport = {
      apelative,
      completeName,
      typeDocument,
      numberDocument,
      initialDateContract,
      finalDateContract,
      chargeName,
      dependenceName,
      linkageType,
      levelCharge: "",
      server,
      filed: observation,
      settlementObservation: observation,
      totalValueInLettersPayable: "valor total en letras a pagar: VEINTIDOS MILLONES DOSCIENTOS OCHENTA Y NUEVE MIL SETECIENTOS CINCO PESOS M.L",
      totalValueInNumberToPay,
      dateResolution: "",
      valueTotalResolution: totalValueInNumberToPay, 
      daysCesantias: `${daysCesantias}`,
      daysInterestSeverancePay: `${daysInterestSeverancePay}`,
      premiumChristmasDays: `${premiumChristmasDays}`,
      vacationDaysAndVacationBonus: `${vacationDaysAndVacationBonus}`,
      daysBonusServices: `${daysPremiumService}`,
      daysPremiumService: `${daysPremiumService}`,
      cesantias: `${cesantias}`,
      interestCesantias: `${interestCesantias}`,
      vacations,
      serviceBonus,
      premiunService,
      recreationBonus,
      salary,
      socialSecurityContributions,
      contributionsAFC,
      retentionSourceIncome,
      totalPagarPrestacionesSociales: totalValueInNumberToPay, // confirmar
      paragraphOne:"El Director General de la Agencia de Educación Postsecundaria de Medellín - Sapiencia, en uso de sus facultades legales y estatutarias contenidas en el Decreto con fuerza de Acuerdo 1364 de 2012, modificado por el Decreto con fuerza de Acuerdo 883 de 2015, el Acuerdo Municipal 019 de 2020 y las señaladas en el Estatuto General de la entidad contenido en el Acuerdo Directivo 003 de 2013, el Acuerdo Directivo 014 de 2015, modificados por el Acuerdo Directivo 29 de 2021 – Por el cual se expide el Estatuto General de la Agencia de Educación Postsecundaria de Medellín – Sapiencia, y",
      paragraphTwo:"La Agencia de Educación Postsecundaria de Medellín – SAPIENCIA, es una unidad administrativa especial, del orden municipal, con personería jurídica, adscrita, según el Acuerdo 01 de 2016 al despacho del Alcalde, creada por Decreto con facultades especiales No. 1364 de 2012, modificado por el Decreto 883 de 2015 y su administración corresponde al Director General, quien será el representante legal.",
      nameFirmDocument:"CARLOS ALBERTO CHAPARRO SANCHEZ",
    }
    return dataReport;
  }


  structureDataProofOfContractsReport = (data: any) => {

    const contracts = data.map(contract => {
      return ({
        numberContract: contract.contractNumber,
        objectContract: contract.contractualObject,
        contractualObligations: [
          { text: contract.specificObligations },
        ],
        contractValue: contract.totalValue,
        startDate: contract.startDate,
        endDate: contract.endDate,
        executionPlace: '',
        compliance: '',
        sanctions: ''
      })
    })

    const { typeDocument, numberDocument, firstName, secondName, surname, secondSurname } = data[0].worker;
    const actualDate = new Date();
    const year = actualDate.getFullYear();
    // El mes es devuelto de 0 a 11, por lo que se suma 1 para obtener el mes actual
    const day = actualDate.getDate().toString().padStart(2, '0');
    const monthName = actualDate.toLocaleDateString('es-ES', { month: 'long' });
    let dayLetters = this.convertNumberDayInLetters(day)

    const dataReport = {
      contracts,
      completeName: `${firstName} ${secondName} ${surname} ${secondSurname}`,
      typeDocument: typeDocument,
      numberDocument: numberDocument,
      letterActualDay: `${dayLetters}`,
      numberActualDay: `${day}`,
      actualMonth: `${monthName}`,
      actualYear: `${year}`,
      universityProfessionalName: "Daniela Perez"
    }
    return dataReport;
  }

  convertNumberDayInLetters(numero: string) {

    let days = {
      "01": "Uno",
      "02": "Dos",
      "03": "Tres",
      "04": "Cuatro",
      "05": "Cinco",
      "06": "Seis",
      "07": "Siete",
      "08": "Ocho",
      "09": "Nueve",
      "10": "Diez",
      "11": "Once",
      "12": "Doce",
      "13": "Trece",
      "14": "Catorce",
      "15": "Quince",
      "16": "Dieciseis",
      "17": "Diecisiete",
      "18": "Dieciocho",
      "19": "Diecinueve",
      "20": "Veinte",
      "21": "Veintiuno",
      "22": "Veintidos",
      "23": "Veintitres",
      "24": "Veinticuatro",
      "25": "Veinticinco",
      "26": "Veintiseis",
      "27": "Veintisiete",
      "28": "Veintiocho",
      "29": "Veintinueve",
      "30": "treinta",
      "31": "treinta y Uno",
    }

    return days[numero]
  }


}
