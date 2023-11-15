// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ReportProvider from "@ioc:core.ReportProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

export default class ReportController {
  public async payrollDownloadById({ response, request }: HttpContextContract) {
    try {
      const { id } = request.params();
      response.header("Content-Type", "application/vnd.ms-excel");
      response.header(
        "Content-Disposition",
        "attachment; filename=ReportePlanilla.xlsx"
      );
      const result = await ReportProvider.payrollDownloadById(id);
      response.send(new ApiResponse(result, EResponseCodes.OK));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async generateWordReport({ response }: HttpContextContract) {
    try {
      response.header(
        "Content-Disposition",
        "attachment;filename=reporte.docx"
      );
      response.type(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      const result = await ReportProvider.generateWordReport();
      response.send(new ApiResponse(result, EResponseCodes.OK));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async generatePDFStub({ response }: HttpContextContract) {
    try {
      // response.header(
      //   "Content-Disposition",
      //   "attachment;filename=reporte.docx"
      // );
      // response.type(
      //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      // );

      response.header("Content-Type", "application/pdf");
      response.header("Content-Disposition", `inline; filename=archivo.pdf`);
      response.send(await ReportProvider.generatePDFStub());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
