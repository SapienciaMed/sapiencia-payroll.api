import fsPromises from "fs/promises";
import path from "path";

import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IReportsRepository } from "App/Repositories/ReportsRepository";
import { IReport, IReportResponse } from "App/Interfaces/ReportInterfaces";
import { ETypeReport } from "App/Constants/Report.Enum";
import CoreService from "./External/CoreService";
import {
  EDeductionTypes,
  EIncomeTypes,
} from "App/Constants/PayrollGenerateEnum";
import { EIncomeType } from "App/Constants/OtherIncome.enum";

export interface IReportService {
  payrollDownloadById(id: number): Promise<ApiResponse<any>>;
  generateWordReport(): Promise<ApiResponse<any>>;
  generateReport(report: IReport): Promise<ApiResponse<IReportResponse>>;
}

export default class ReportService implements IReportService {
  constructor(
    public reportRepository: IReportsRepository,
    public coreService: CoreService
  ) {}

  async generateWordReport(): Promise<ApiResponse<any>> {
    const result = this.reportRepository.generateWordReport();
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

    if (report.typeReport === ETypeReport.Colilla) {
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

    const reportInformation =
      await this.reportRepository.getPayrollInformationYear(
        Number(report.period),
        Number(report.codEmployment)
      );
    const parameters = await this.coreService.getParametersByCodes([
      "NIT",
      "RAZON_SOCIAL_REPORTES",
      "COD_TIPO_DOCUMENTO",
      "COD_DEPARTAMENTO",
      "COD_CIUDAD",
      "CIUDAD_REP",
    ]);

    const nit = Number(parameters.find((i) => i.id == "NIT")?.value || 0);

    const socialReason =
      parameters.find((i) => i.id == "RAZON_SOCIAL_REPORTES")?.value || "";

    const codeTypeDocument =
      parameters.find((i) => i.id == "COD_TIPO_DOCUMENTO")?.value || "";

    const codeDeparment =
      parameters.find((i) => i.id == "COD_DEPARTAMENTO")?.value || "";

    const codeCity = parameters.find((i) => i.id == "COD_CIUDAD")?.value || "";

    const city = parameters.find((i) => i.id == "CIUDAD_REP")?.value || "";

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

      relationDependent = relationshipMapping[dependent[0].relationship] ?? "";
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
}
