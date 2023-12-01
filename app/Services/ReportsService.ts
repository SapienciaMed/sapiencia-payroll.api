import fsPromises from "fs/promises";
import path from "path";
import { numberToColombianPesosWord } from "@isildur1/number-to-word";

import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IReportsRepository } from "App/Repositories/ReportsRepository";
import {
  IDetailColillaPDF,
  IReport,
  IReportCombinePDFs,
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
import { Packer } from "docx";

export interface IReportService {
  payrollDownloadById(id: number): Promise<ApiResponse<any>>;
  generateReport(report: IReport): Promise<ApiResponse<IReportResponse>>;
  // generateWordReport(): Promise<ApiResponse<any>>;
}

export default class ReportService implements IReportService {
  constructor(
    public reportRepository: IReportsRepository,
    public coreService: CoreService
  ) {}

  // async generateWordReport(): Promise<ApiResponse<any>> {
  //   let noReport = 2;
  //   let report;
  //   let result;
  //   let data;
  //   if (noReport == 1) {
  //     const administrativeActReport = new AdministrativeActReport();
  //     data = await this.reportRepository.getPayrollInformationLiquidationYear(
  //       2023,
  //       20
  //     );
  //     const dataReport = this.structureDataAdministrativeActReport(data);
  //     report = await administrativeActReport.generateReport(dataReport);
  //   }
  //   if (noReport == 2) {
  //     data = await this.reportRepository.getPayrollInformationContractsYear(
  //       2023,
  //       25
  //     );
  //     const dataReport = this.structureDataProofOfContractsReport(data);
  //     const proofOfContracts = new ProofOfContracts();
  //     report = await proofOfContracts.generateReport(dataReport);
  //   }

  //   result = this.reportRepository.generateWordReport(report);
  //   return data;
  // }

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
      "PRIMER_PARAM_VACACIONES",
      "SEG_PARAM_VACACIONES",
      "TERCER_PARAM_VACACIONES",
      "PRIMER_PARAM_LIQUIDACION",
      "SEG_PARAM_LIQUIDACION",
      "TERCER_PARAM_LIQUIDACION",
      "CUARTO_PARAM_LIQUIDACION",
    ]);

    const nit = Number(parameters.find((i) => i.id == "NIT")?.value ?? 0);
    const nameProfesional =
      parameters.find((i) => i.id == "PROF_TALENTOH")?.value ?? "";

    if (report.typeReport === ETypeReport.Colilla) {
      await this.vaucherPay(report, response, nit);
    } else if (
      report.typeReport === ETypeReport.CertificadoIngresosRetenciones
    ) {
      await this.generateIncomesWithholdingsCertificate(
        report,
        parameters,
        response
      );
    } else if (report.typeReport === ETypeReport.CertificadoLaboral) {
      await this.generateWorkCertificate(report, response, nameProfesional);
    } else if (report.typeReport === ETypeReport.ResolucionVacaciones) {
      const firstParam =
        parameters.find((i) => i.id == "PRIMER_PARAM_VACACIONES")?.value ?? "";
      const secondParam =
        parameters.find((i) => i.id == "SEG_PARAM_VACACIONES")?.value ?? "";
      const thirdParam =
        parameters.find((i) => i.id == "TERCER_PARAM_VACACIONES")?.value ?? "";
      const param = { firstParam, secondParam, thirdParam };
      const dataReport = await this.reportRepository.getPayrollVacationsYear(
        report.period,
        report.codEmployment ?? 0
      );
      const vacationResolution = new VacationResolution();
      const vacationResolutionGenerate =
        await vacationResolution.generateReport(dataReport, param);
      const buffer = await Packer.toBuffer(vacationResolutionGenerate);
      // const result = this.reportRepository.generateWordReport(
      //   vacationResolutionGenerate
      // );
      response.bufferFile = buffer;
      response.nameFile = "resolucion_vacaciones.docx";

      return new ApiResponse(response, EResponseCodes.OK);
    } else if (
      report.typeReport === ETypeReport.ResolucionLiquidacionDefinitiva
    ) {
      const administrativeActReport = new AdministrativeActReport();
      const data =
        await this.reportRepository.getPayrollInformationLiquidationYear(
          report.period,
          report.codEmployment ?? 0
        );
      const dataReport = this.structureDataAdministrativeActReport(
        data,
        parameters
      );
      const reportResult = await administrativeActReport.generateReport(
        dataReport
      );
      const buffer = await Packer.toBuffer(reportResult);
      response.bufferFile = buffer;
      response.nameFile = "resolucion_liquidacion.docx";
      return new ApiResponse(response, EResponseCodes.OK);
    } else if (report.typeReport === ETypeReport.ConstanciaContratos) {
      const data =
        await this.reportRepository.getPayrollInformationContractsYear(
          report.period,
          report.codEmployment ?? 0
        );
      const dataReport = this.structureDataProofOfContractsReport(
        data,
        parameters
      );
      const proofOfContracts = new ProofOfContracts();
      const reportResult = await proofOfContracts.generateReport(dataReport);
      const buffer = await Packer.toBuffer(reportResult);
      // const result = this.reportRepository.generateWordReport(
      //   vacationResolutionGenerate
      // );
      response.bufferFile = buffer;
      response.nameFile = "constancia_contratos.docx";

      return new ApiResponse(response, EResponseCodes.OK);
    } else {
      return new ApiResponse(response, EResponseCodes.FAIL);
    }
    return new ApiResponse(response, EResponseCodes.OK);
  }

  async vaucherPay(report: IReport, response: IReportResponse, nit: number) {
    const reportInformationColilla =
      await this.reportRepository.getPayrollInformationEmployment(
        Number(report.period),
        report.codEmployment ?? null
      );

    if (
      !reportInformationColilla[0].historicalPayroll ||
      reportInformationColilla[0].historicalPayroll.length <= 0
    ) {
      throw new Error("No tiene historico de planilla");
    }

    console.time("TimerMapPdf");

    const bufferFiles = (await Promise.all(
      reportInformationColilla[0].historicalPayroll.map(async (i) => {
        const numberDocument =
          i.employment?.worker?.numberDocument ?? "Sin documento";

        const nombreBanco = i.employment?.worker?.bank ?? "Sin banco asociado";

        const numeroCuentaBanco =
          i.employment?.worker?.accountBankNumber ??
          "Sin cuenta de banco asociada";

        const fullName = `${i.employment?.worker?.firstName} ${i.employment?.worker?.secondName} ${i.employment?.worker?.surname} ${i.employment?.worker?.secondSurname}`;

        const salaryBasic = i.employment?.charge?.baseSalary ?? "";

        const charge = i.employment?.charge?.name ?? "";

        const dependence = i.employment?.dependence?.name ?? "";

        const incomesEmployment =
          reportInformationColilla?.[0]?.incomes?.filter(
            (income) => Number(income.idEmployment) === Number(i.employment?.id)
          ) ?? [];

        const deductionsEmployment =
          reportInformationColilla?.[0]?.deductions?.filter(
            (deduction) =>
              Number(deduction.idEmployment) === Number(i.employment?.id)
          ) ?? [];

        const arrIncomeAndDeductions = [
          ...incomesEmployment,
          ...deductionsEmployment,
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
                objectReturn.name =
                  i.deductionTypeOne?.name ?? "No hay detalle";
              }

              objectReturn.type = "Deduction";
            }

            objectReturn.value = formaterNumberToCurrency(i.value ?? 0);
            objectReturn.days = String(i.time ?? "0");

            return objectReturn;
          }
        );

        const totalIncomes = incomesEmployment.reduce(
          (sum, i) => sum + Number(i.value),
          0
        );

        const totalDeductions = deductionsEmployment.reduce(
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
          fechaInicio: reportInformationColilla[0]?.dateStart,
          fechaFin: reportInformationColilla[0]?.dateEnd,
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

        return {
          bufferFile: bufferPDF,
          name: `${Date.now()}.pdf`,
        };
      })
    )) as IReportCombinePDFs[];

    console.timeEnd("TimerMapPdf");

    const bufferPDFCombinado = await this.reportRepository.combinePDFs(
      bufferFiles
    );

    response.bufferFile = bufferPDFCombinado;
    response.nameFile = `colilla.pdf`;

    return new ApiResponse(response, EResponseCodes.OK);
  }

  async generateIncomesWithholdingsCertificate(report, parameters, response) {
    const reportInformation =
      await this.reportRepository.getPayrollInformationYear(
        Number(report.period),
        Number(report.codEmployment)
      );
    const nit = Number(parameters.find((i) => i.id == "NIT")?.value ?? 0);
    const socialReason =
      parameters.find((i) => i.id == "RAZON_SOCIAL_REPORTES")?.value ?? "";
    const codeTypeDocument =
      parameters.find((i) => i.id == "COD_TIPO_DOCUMENTO")?.value ?? "";
    const codeDeparment =
      parameters.find((i) => i.id == "COD_DEPARTAMENTO")?.value ?? "";
    const codeCity = parameters.find((i) => i.id == "COD_CIUDAD")?.value ?? "";
    const city = parameters.find((i) => i.id == "CIUDAD_REP")?.value ?? "";
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
    let typeDocumentDependent = "";
    let numberDocumentDependent = "";
    if (dependent.length > 0) {
      dependent[0].name ?? "";
      nameDependent = dependent[0].name ?? "";
      const relationshipMapping = {
        "1": "Espos@",
        "2": "Hij@",
        "3": "Hijastr@",
      };
      const documentTypeMapping = {
        CC: "Cédula de Ciudadanía",
        CE: "Cédula de Extranjería",
        TI: "Tarjeta de Identidad",
        NIT: "NIT",
        AN: "Anónimo",
      };
      typeDocumentDependent =
        documentTypeMapping[dependent[0].typeDocument ?? "CC"];
      numberDocumentDependent = dependent[0].numberDocument;
      relationDependent = relationshipMapping[dependent[0].relationship] ?? "";
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
            i.idTypeDeduction === EDeductionTypes.voluntaryPensionContributions
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
      typeDocumentDependent,
      numberDocumentDependent,
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

  async generateWorkCertificate(report, response, nameProfesional) {
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
      new Date(reportInformation?.startDate.toString() ?? new Date().toString())
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

  // Estructuración de datos para generar reporte en word

  structureDataAdministrativeActReport = (data: any, parameters: any) => {
    const { total: totalValueInNumberToPay, salary } =
      data[0].historicalPayroll[0];

    const cesantiasData = data[0].incomes.filter(
      (e) => e.idTypeIncome === EIncomeTypes.severancePay
    );
    const cesantiasDataAccumulative = cesantiasData.reduce(
      function (result, element) {
        result.value += parseFloat(element.value);
        result.time += element.time;
        return result;
      },
      { value: 0, time: 0 }
    );
    const { time: daysCesantias, value: cesantias } = cesantiasDataAccumulative;

    const interestCesantiasData = data[0].incomes.filter(
      (e) => e.idTypeIncome === EIncomeTypes.severancePayInterest
    );
    const interesCesantiasDataAccumulative = interestCesantiasData.reduce(
      function (result, element) {
        result.value += parseFloat(element.value);
        result.time += element.time;
        return result;
      },
      { value: 0, time: 0 }
    );
    const { time: daysInterestSeverancePay, value: interestCesantias } =
      interesCesantiasDataAccumulative;

    const premiumChristmasDaysData = data[0].incomes.filter(
      (e) => e.idTypeIncome === EIncomeTypes.primaChristmas
    );
    const premiumChristmasDaysDataAccumulative =
      premiumChristmasDaysData.reduce(
        function (result, element) {
          result.value += parseFloat(element.value);
          result.time += element.time;
          return result;
        },
        { value: 0, time: 0 }
      );
    const { time: premiumChristmasDays } = premiumChristmasDaysDataAccumulative;

    const vacationDaysAndVacationBonusData = data[0].incomes.filter(
      (e) => e.idTypeIncome === EIncomeTypes.primaVacations
    );
    const vacationDaysAndVacationBonusDataAccumulative =
      vacationDaysAndVacationBonusData.reduce(
        function (result, element) {
          result.value += parseFloat(element.value);
          result.time += element.time;
          return result;
        },
        { value: 0, time: 0 }
      );
    const { time: vacationDaysAndVacationBonus } =
      vacationDaysAndVacationBonusDataAccumulative;

    const vacationsData = data[0].incomes.filter(
      (e) => e.idTypeIncome === EIncomeTypes.vacation
    );
    const vacationsDataAccumulative = vacationsData.reduce(
      function (result, element) {
        result.value += parseFloat(element.value);
        result.time += element.time;
        return result;
      },
      { value: 0, time: 0 }
    );
    const { value: vacations } = vacationsDataAccumulative;

    const bonusServicesData = data[0].incomes.filter(
      (e) => e.idTypeIncome === EIncomeTypes.serviceBonus
    );
    const bonusServicesDataAccumulative = bonusServicesData.reduce(
      function (result, element) {
        result.value += parseFloat(element.value);
        result.time += element.time;
        return result;
      },
      { value: 0, time: 0 }
    );
    const { value: serviceBonus } = bonusServicesDataAccumulative;

    const premiumServiceData = data[0].incomes.filter(
      (e) => e.idTypeIncome === EIncomeTypes.primaService
    );
    const premiumServiceDataAccumulative = premiumServiceData.reduce(
      function (result, element) {
        result.value += parseFloat(element.value);
        result.time += element.time;
        return result;
      },
      { value: 0, time: 0 }
    );
    const { time: daysPremiumService, value: premiunService } =
      premiumServiceDataAccumulative;

    const recreationBonusData = data[0].incomes.filter(
      (e) => e.idTypeIncome === EIncomeTypes.bonusRecreation
    );
    const recreationBonusDataAccumulative = recreationBonusData.reduce(
      function (result, element) {
        result.value += parseFloat(element.value);
        result.time += element.time;
        return result;
      },
      { value: 0, time: 0 }
    );
    const { value: recreationBonus } = recreationBonusDataAccumulative;

    const socialSecurityData = data[0].deductions.filter(
      (e) =>
        e.idTypeDeduction === EDeductionTypes.SocialSecurity ||
        e.idTypeDeduction === EDeductionTypes.retirementFund
    );
    const socialSecurityDataAccumulative = socialSecurityData.reduce(
      function (result, element) {
        result.value += parseFloat(element.value);
        result.time += element.time;
        return result;
      },
      { value: 0, time: 0 }
    );
    const { value: socialSecurityContributions } =
      socialSecurityDataAccumulative;

    const contributionsAFCData = data[0].deductions.filter(
      (e) => e.idTypeDeduction === EDeductionTypes.contributionsAFC
    );
    const contributionsAFCDataAccumulative = contributionsAFCData.reduce(
      function (result, element) {
        result.value += parseFloat(element.value);
        result.time += element.time;
        return result;
      },
      { value: 0, time: 0 }
    );
    const { value: contributionsAFC } = contributionsAFCDataAccumulative;

    const retentionSourceIncomeData = data[0].deductions.filter(
      (e) => e.idTypeDeduction === EDeductionTypes.incomeTax
    );
    const retentionSourceIncomeDataAccumulative =
      retentionSourceIncomeData.reduce(
        function (result, element) {
          result.value += parseFloat(element.value);
          result.time += element.time;
          return result;
        },
        { value: 0, time: 0 }
      );
    const { value: retentionSourceIncome } =
      retentionSourceIncomeDataAccumulative;

    const {
      worker,
      startDate: initialDateContract,
      endDate: finalDateContract,
      charge,
      dependence,
      typesContracts,
      observation,
    } = data[0].historicalPayroll[0].employment;
    const { name: chargeName } = charge;
    const { name: dependenceName } = dependence;
    const { name: linkageType } = typesContracts;
    const {
      gender,
      typeDocument,
      numberDocument,
      firstName,
      secondName,
      surname,
      secondSurname,
    } = worker;

    const apelative =
      gender == "H" ? "El señor" : gender == "M" ? "La señora" : "l@ señor@";
    const server =
      gender == "H"
        ? "El servidor"
        : gender == "M"
        ? "La servidora"
        : "l@ servidor@";
    const completeName = `${firstName} ${secondName} ${surname} ${secondSurname}`;

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
      totalValueInLettersPayable: numberToColombianPesosWord(
        Number(totalValueInNumberToPay).toFixed(2)
      ),
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
      paragraphOne:
        parameters.find((i) => i.id == "PRIMER_PARAM_LIQUIDACION")?.value ?? "",
      paragraphTwo:
        parameters.find((i) => i.id == "SEG_PARAM_LIQUIDACION")?.value ?? "",
      paragraphThree:
        parameters.find((i) => i.id == "TERCER_PARAM_LIQUIDACION")?.value ?? "",
      nameFirmDocument:
        parameters.find((i) => i.id == "CUARTO_PARAM_LIQUIDACION")?.value ?? "",
    };
    return dataReport;
  };

  structureDataProofOfContractsReport = (data: any, parameters: any) => {
    const contracts = data.map((contract) => {
      return {
        numberContract: contract.contractNumber,
        objectContract: contract.contractualObject,
        contractualObligations: [{ text: contract.specificObligations }],
        contractValue: contract.totalValue,
        startDate: contract.startDate,
        endDate: contract.endDate,
        executionPlace: "",
        compliance: "",
        sanctions: "",
      };
    });

    const {
      typeDocument,
      numberDocument,
      firstName,
      secondName,
      surname,
      secondSurname,
    } = data[0].worker;
    const actualDate = new Date();
    const year = actualDate.getFullYear();
    // El mes es devuelto de 0 a 11, por lo que se suma 1 para obtener el mes actual
    const day = actualDate.getDate().toString().padStart(2, "0");
    const monthName = actualDate.toLocaleDateString("es-ES", { month: "long" });
    let dayLetters = this.convertNumberDayInLetters(day);

    const dataReport = {
      contracts,
      completeName: `${firstName} ${secondName} ${surname} ${secondSurname}`,
      typeDocument: typeDocument,
      numberDocument: numberDocument,
      letterActualDay: `${dayLetters}`,
      numberActualDay: `${day}`,
      actualMonth: `${monthName}`,
      actualYear: `${year}`,
      universityProfessionalName:
        parameters.find((i) => i.id == "PRIMER_PARAM_COSTANCIA_CONTRATO")
          ?.value ?? "",
    };
    return dataReport;
  };

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
    };

    return days[numero];
  }
}
