import fsPromises from "fs/promises";
import path from "path";

import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IReportsRepository } from "App/Repositories/ReportsRepository";
import { IReport, IReportResponse } from "App/Interfaces/ReportInterfaces";
import { ETypeReport } from "App/Constants/Report.Enum";
import CoreService from "./External/CoreService";

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
      await this.reportRepository.getPayrollInformationYear(2023, 11);
    const parameters = await this.coreService.getParametersByCodes([
      "NIT",
      "RAZON_SOCIAL_REPORTES",
      "COD_TIPO_DOCUMENTO",
      "COD_DEPARTAMENTO",
      "COD_CIUDAD",
      "CIUDAD_REP",
    ]);

    const nit = Number(parameters.find((i) => (i.id = "NIT"))?.value || 0);

    const socialReason = Number(
      parameters.find((i) => (i.id = "RAZON_SOCIAL_REPORTES"))?.value || 0
    );

    const codeTypeDocument = Number(
      parameters.find((i) => (i.id = "COD_TIPO_DOCUMENTO"))?.value || 0
    );

    const codeDeparment = Number(
      parameters.find((i) => (i.id = "COD_DEPARTAMENTO"))?.value || 0
    );

    const codeCity = Number(
      parameters.find((i) => (i.id = "COD_CIUDAD"))?.value || 0
    );

    const city = Number(
      parameters.find((i) => (i.id = "CIUDAD_REP"))?.value || 0
    );
    
    reportInformation?.map((info)=>{
      info.incomes?.map(()=>{
        
      })
    })


    const data = {
      logoDian: await fsPromises.readFile(
        path.join(process.cwd(), "app", "resources", "img", "logoDian.jpeg"),
        "base64"
      ),
      logo220: await fsPromises.readFile(
        path.join(process.cwd(), "app", "resources", "img", "220Dian.jpeg"),
        "base64"
      ),
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
