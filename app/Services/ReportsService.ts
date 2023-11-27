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

import {
  formaterNumberSeparatorMiles,
  formaterNumberToCurrency,
} from "../Utils/functions";
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
    public coreService: CoreService,
    private workerRepository: IWorkerRepository
  ) {}

  async generateWordReport(): Promise<ApiResponse<any>> {
    const administrativeActReport = new AdministrativeActReport();
    const proofOfContracts = new ProofOfContracts();
    const vacationResolution = new VacationResolution();
    const report = await administrativeActReport.generateReport();
    const report2 = await proofOfContracts.generateReport();
    const report3 = await vacationResolution.generateReport();
    const result = this.reportRepository.generateWordReport(report2);
    return result;
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
        Nombre: `${historical.employment?.worker?.firstName} ${
          historical.employment?.worker?.secondName ?? ""
        } ${historical.employment?.worker?.surname} ${
          historical.employment?.worker?.secondSurname
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
      "PROF_TALENTOH",
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

    const nameProfesional =
      parameters.find((i) => i.id == "PROF_TALENTOH")?.value ?? "";

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
            if (i.deductionTypeOne?.type === "Ciclica") {
              objectReturn.name = i.deductionTypeOne?.name
                ? `Deducciones cíclicas ${i.deductionTypeOne?.name}`
                : "No hay detalle";
            } else if (i.deductionTypeOne?.type === "Eventual") {
              objectReturn.name = i.deductionTypeOne?.name
                ? `Deducciones eventuales ${i.deductionTypeOne?.name}`
                : "No hay detalle";
            } else {
              objectReturn.name = i.deductionTypeOne?.name ?? "No hay detalle";
            }

            objectReturn.type = "Deduction";
          }

          objectReturn.value = formaterNumberToCurrency(i.value ?? 0);
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
        Number(restaIncomesDeductions.toFixed(2) ?? 0)
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
        nit: formaterNumberSeparatorMiles(nit),
        fechaInicio: reportInformationColilla?.dateStart,
        fechaFin: reportInformationColilla?.dateEnd,
        numeroDocument: numberDocument,
        nombreCompleto: fullName,
        nombreBanco,
        numeroCuentaBanco,
        sueldoBasico: formaterNumberToCurrency(salaryBasic ?? 0),
        cargo: charge,
        dependencia: dependence,
        arrIncomeAndDeductionsFormated,
        totalIncomes: formaterNumberToCurrency(totalIncomes ?? 0),
        totalDeductions: formaterNumberToCurrency(totalDeductions ?? 0),
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
      response.nameFile = `${Date.now()}.pdf`;

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
          ? `${new Date().getDate()}/${
              new Date().getMonth() + 1
            }/${new Date().getFullYear()}`
          : `31/12/${report.period}`;
      let expeditionDate = `${new Date().getDate()}/${
        new Date().getMonth() + 1
      }/${new Date().getFullYear()}`;

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

    if (report.typeReport === ETypeReport.CertificadoLaboral) {
      const reportInformation =
        await this.reportRepository.getVinculationInformation(
          Number(report.codEmployment)
        );

      const treatment =
        reportInformation?.worker?.gender == "H"
          ? "El señor"
          : reportInformation?.worker?.gender == "M"
          ? "La señora"
          : "E@ señor@";
      const name = `${
        reportInformation?.worker?.firstName +
        " " +
        reportInformation?.worker?.secondName +
        " " +
        reportInformation?.worker?.surname +
        " " +
        reportInformation?.worker?.secondSurname
      }`;
      const documentTypeMapping = {
        CC: "Cédula de Ciudadanía",
        CE: "Cédula de Extranjería",
        TI: "Tarjeta de Identidad",
        NIT: "NIT",
        AN: "Anónimo",
      };

      const documentType =
        documentTypeMapping[reportInformation?.worker?.typeDocument ?? "CC"];

      const numberDocument = reportInformation?.worker?.numberDocument;

      const vinculationDate = `${new Date(
        reportInformation?.startDate.toString() ?? new Date().toString()
      ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
        month: "long",
      }).format(
        new Date(
          reportInformation?.startDate.toString() ?? new Date().toString()
        )
      )} ${new Date(
        reportInformation?.startDate.toString() ?? new Date().toString()
      ).getFullYear()}`;

      const vinculationType = reportInformation?.typesContracts?.[0].name;

      const charge = reportInformation?.charge?.name;

      const dependency = reportInformation?.dependence?.name;

      const specificObligations = reportInformation?.specificObligations;

      const date = `${new Date().getDate()} de ${new Intl.DateTimeFormat(
        "es-ES",
        {
          month: "long",
        }
      ).format(new Date())} ${new Date().getFullYear()}`;

      const data = {
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
        treatment,
        name,
        documentType,
        numberDocument,
        vinculationDate,
        vinculationType,
        charge,
        dependency,
        specificObligations,
        date,
        nameProfesional,
      };

      const bufferPDF = await this.reportRepository.generatePdf(
        "certificadoLaboral.hbs",
        data,
        false,
        "certificaLaboral.css",
        200,
        150,
        35,
        35,
        "Header.hbs",
        "Footer.hbs"
      );

      response.bufferFile = bufferPDF;
      response.nameFile = "certificadoLaboral.pdf";

      return new ApiResponse(response, EResponseCodes.OK);
    }

    return new ApiResponse(response, EResponseCodes.OK);
  }
}
