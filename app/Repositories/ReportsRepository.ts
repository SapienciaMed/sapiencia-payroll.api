import * as XLSX from "xlsx";
import { Packer } from "docx";

import puppeteer, { Browser } from "puppeteer";
import Handlebars from "handlebars";
import path from "path";
import fsPromise from "fs/promises";

import DeductionType from "App/Models/DeductionType";
import IncomeType from "App/Models/IncomeType";
import ReserveType from "App/Models/ReserveType";
import FormsPeriod from "App/Models/FormsPeriod";

import {
  EDeductionTypes,
  EPayrollTypes,
} from "App/Constants/PayrollGenerateEnum";
import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import { IIncomeType } from "App/Interfaces/IncomeTypesInterfaces";
import { IReserveType } from "App/Interfaces/ReserveTypesInterfaces";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import * as fs from "fs/promises";
import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import Employment from "App/Models/Employment";
import { PDFDocument } from "pdf-lib";
import { IReportCombinePDFs } from "App/Interfaces/ReportInterfaces";
import VacationDay from "App/Models/VacationDay";
import { IVacationDay } from "App/Interfaces/VacationDaysInterface";

export interface IReportsRepository {
  getPayrollInformation(codPayroll: number): Promise<IFormPeriod | null>;
  getAllIncomesTypes(): Promise<IIncomeType[]>;
  getAllDeductionsTypes(): Promise<IDeductionType[]>;
  getAllReservesTypes(): Promise<IReserveType[]>;
  getVinculationInformation(employmentId: number): Promise<IEmployment | null>;
  generateXlsx(rows: any): Promise<any>;
  generateWordReport(doc: any): Promise<any>;
  generatePdf(
    nameTemplate: string,
    dataContentPDF: object,
    printBackground: boolean,
    nameCssFile?: string,
    top?: number,
    bottom?: number,
    left?: number,
    right?: number,
    nameTemplateHeaderPDF?: string,
    nameTemplateFooterPDF?: string
  ): Promise<Buffer>;
  getPayrollInformationEmployment(
    codPayroll: number,
    codEmployment: number | null
  ): Promise<IFormPeriod[]>;
  getPayrollInformationYear(
    year: number,
    codEmployment: number
  ): Promise<IFormPeriod[] | null>;
  getPayrollInformationLiquidationYear(
    year: number,
    codEmployment: number
  ): Promise<IFormPeriod[] | null>;
  getPayrollInformationContractsYear(
    year: number,
    codEmployment: number
  ): Promise<IEmployment[] | null>;
  getPayrollVacationsYear(
    codVacationDays: number,
    codEmployment: number
  ): Promise<IVacationDay[] | null>;
  combinePDFs(PDFs: IReportCombinePDFs[]): Promise<Buffer>;
}

export default class ReportsRepository implements IReportsRepository {
  constructor() {}

  async getPayrollInformation(codPayroll: number): Promise<IFormPeriod | null> {
    const res = await FormsPeriod.query()
      .preload("deductions")
      .preload("incomes")
      .preload("reserves")
      .preload("historicalPayroll", (subq) =>
        subq.preload("employment", (subq2) => subq2.preload("worker"))
      )
      .where("id", codPayroll)
      .first();

    if (!res) {
      return null;
    }

    return res.serialize() as IFormPeriod;
  }

  async getPayrollInformationYear(
    year: number,
    codEmployment: number
  ): Promise<IFormPeriod[] | null> {
    const res = await FormsPeriod.query()
      .whereHas("historicalPayroll", (history) => {
        history
          .where("idEmployment", codEmployment)
          .andWhere("state", "Exitoso")
          .preload("employment", (employment) => {
            employment.preload("worker", (workerQuery) => {
              workerQuery.preload("relatives");
            });
          });
      })
      .preload("deductions", (deductionQuery) => {
        deductionQuery.where("idEmployment", codEmployment);
      })
      .preload("incomes", (incomeQuery) => {
        incomeQuery.where("idEmployment", codEmployment);
      })
      .preload("reserves", (reservesQuery) => {
        reservesQuery.where("idEmployment", codEmployment);
      })
      .preload("historicalPayroll", (history) => {
        history
          .where("idEmployment", codEmployment)
          .andWhere("state", "Exitoso")
          .preload("employment", (employment) => {
            employment.preload("worker", (workerQuery) => {
              workerQuery.preload("relatives");
            });
          });
      })
      .where("year", year)
      .andWhere("state", "<>", "Pendiente");
    if (!res) {
      return null;
    }

    return res.map((formPeriod) => formPeriod.serialize() as IFormPeriod);
  }

  async getPayrollVacationsYear(
    codVacationDays: number,
    codEmployment: number
  ): Promise<IVacationDay[] | null> {
    const res = await VacationDay.query()
      .preload("formPeriod", (formPeriodQuery) => {
        formPeriodQuery
          .preload("historicalPayroll", (history) => {
            history.where("idEmployment", codEmployment);
          })
          .preload("deductions", (deductionQuery) => {
            deductionQuery.where("idEmployment", codEmployment);
          })
          .preload("incomes", (incomeQuery) => {
            incomeQuery.where("idEmployment", codEmployment);
          })
          .preload("reserves", (reservesQuery) => {
            reservesQuery.where("idEmployment", codEmployment);
          });
      })
      .preload("vacation", (vacationQuery) => {
        vacationQuery.preload("employment", (employmentQuery) => {
          employmentQuery
            .preload("worker")
            .preload("charge")
            .preload("dependence")
            .preload("salaryHistories", (salaryQuery) => {
              salaryQuery.where("validity", true);
            });
        });
        // vacationQuery.where("codEmployment", codEmployment);
      })
      .where("id", codVacationDays);

    if (!res) {
      return null;
    }

    return res.map((formPeriod) => formPeriod.serialize() as IVacationDay);
  }

  async getPayrollInformationLiquidationYear(
    year: number,
    codEmployment: number
  ): Promise<IFormPeriod[] | null> {
    const res = await FormsPeriod.query()
      .preload("deductions", (deductionQuery) => {
        deductionQuery.where("idEmployment", codEmployment);
      })
      .preload("incomes", (incomeQuery) => {
        incomeQuery.where("idEmployment", codEmployment);
      })
      .preload("reserves", (reservesQuery) => {
        reservesQuery.where("idEmployment", codEmployment);
      })
      .preload("historicalPayroll", (history) => {
        history
          .where("idEmployment", codEmployment)
          .preload("employment", (employment) => {
            employment.preload("worker");
            employment.preload("charge");
            employment.preload("dependence");
            employment.preload("typesContracts");
          });
      })
      .where("year", year)
      .andWhere("idFormType", EPayrollTypes.liquidation);
    /* .andWhere("state", EPayrollState.authorized); */

    if (!res) {
      return null;
    }
    return res.map((formPeriod) => formPeriod.serialize() as IFormPeriod);
  }

  async getPayrollInformationContractsYear(
    year: number,
    codEmployment: number
  ): Promise<IEmployment[] | null> {
    console.log(year);
    const res = await Employment.query()
      .preload("worker")
      .preload("typesContracts")
      .where("id", codEmployment);
    /* .whereBetween("startDate", [
        new Date(`01/01/${year}`),
        new Date(`31/12/${year}`),
      ])
      .andWhereBetween("endDate", [
        new Date(`01/01/${year}`),
        new Date(`31/12/${year}`),
      ]); */

    if (!res) {
      return null;
    }

    return res.map((formPeriod) => formPeriod.serialize() as IEmployment);
  }

  async getPayrollInformationEmployment(
    codPayroll: number,
    codEmployment: number
  ): Promise<IFormPeriod[]> {
    const res = await FormsPeriod.query()
      .preload("deductions", (deductionsQuery) => {
        if (codEmployment) {
          deductionsQuery.where("idEmployment", codEmployment);
        }
        deductionsQuery
          .whereNot("idTypeDeduction", EDeductionTypes.dependentPeople)
          .whereNot("idTypeDeduction", EDeductionTypes.rentExempt)
          .preload("deductionTypeOne");
      })
      .preload("incomes", (incomesQuery) => {
        if (codEmployment) {
          incomesQuery.where("idEmployment", codEmployment);
        }

        incomesQuery.preload("incomeType");
      })
      .preload("reserves")
      .preload("historicalPayroll", (historicalPayrollQuery) => {
        if (codEmployment) {
          historicalPayrollQuery.where("idEmployment", codEmployment);
        }

        historicalPayrollQuery
          .whereNot("state", "Fallido")
          .preload("employment", (employment) => {
            employment.preload("worker");
            employment.preload("charge");
            employment.preload("dependence");
          });
      })
      .where("id", codPayroll);

    return res.map((i) => i.serialize()) as IFormPeriod[];
  }
  async getAllIncomesTypes(): Promise<IIncomeType[]> {
    const res = await IncomeType.query();
    return res.map((i) => i.serialize() as IIncomeType);
  }

  async getAllDeductionsTypes(): Promise<IDeductionType[]> {
    const res = await DeductionType.query();
    return res.map((i) => i.serialize() as IDeductionType);
  }

  async getAllReservesTypes(): Promise<IReserveType[]> {
    const res = await ReserveType.query();
    return res.map((i) => i.serialize() as IReserveType);
  }

  async getVinculationInformation(
    employmentId: number
  ): Promise<IEmployment | null> {
    const res = await Employment.query()
      .preload("dependence")
      .preload("charge")
      .preload("worker")
      .preload("typesContracts")
      .where("id", employmentId)
      .andWhere("state", true)
      .first();
    if (!res) {
      return null;
    }
    return res.serialize() as IEmployment;
  }

  async generateXlsx(rows: any): Promise<any> {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    return buffer;
  }

  async generateWordReport(doc: any): Promise<any> {
    // Guardar el documento en un archivo
    const buffer = await Packer.toBuffer(doc);
    // Definir la ruta del archivo y el nombre
    const filePath = "./tmp/reportWord.docx";
    fs.unlink(filePath);
    // Escribir el buffer en el archivo
    await fs.writeFile(filePath, buffer);
    return buffer;
  }

  async generatePdf(
    nameTemplate: string,
    dataContentPDF: object,
    printBackground: boolean,
    nameCssFile?: string,
    top: number = 10,
    bottom: number = 30,
    left: number = 35,
    right: number = 35,
    nameTemplateHeaderPDF?: string,
    nameTemplateFooterPDF?: string
  ): Promise<Buffer> {
    let headerHtml = "";
    let headerTemplates;
    let contentHeaderPDFHtml;
    const templateHtml = await fsPromise.readFile(
      path.join(process.cwd(), "app", "resources", "template", nameTemplate),
      "utf-8"
    );

    Handlebars.registerHelper("eq", (a, b) => a == b);

    const template = Handlebars.compile(templateHtml);

    const contentPDFHtml = template(dataContentPDF);

    let browser: Browser;

    //Configuracion para pruebas
    // browser = await puppeteer.launch({
    //   headless: "new",
    //   args: ["--no-sandbox"],
    //   executablePath: "/usr/bin/chromium",
    // });

    // Configuracion local proyecto
    browser = await puppeteer.launch({
      headless: "new",
      // slowMo: 400,
    });

    const page = await browser.newPage();

    await page.setContent(contentPDFHtml, {
      waitUntil: "load",
    });

    if (nameCssFile) {
      const contentCss = await fsPromise.readFile(
        path.join(process.cwd(), "app", "resources", "css", nameCssFile),
        "utf-8"
      );

      await page.addStyleTag({ content: contentCss });
    }

    await new Promise((r) => setTimeout(r, 1000));

    if (nameTemplateHeaderPDF) {
      headerHtml = await fsPromise.readFile(
        path.join(
          process.cwd(),
          "app",
          "resources",
          "template",
          nameTemplateHeaderPDF
        ),
        "utf-8"
      );
      headerTemplates = Handlebars.compile(headerHtml);
      contentHeaderPDFHtml = headerTemplates(dataContentPDF);
    }
    const bufferPDF = await page.pdf({
      format: "A4",
      displayHeaderFooter: !!nameTemplateHeaderPDF || !!nameTemplateFooterPDF,
      headerTemplate: nameTemplateHeaderPDF ? contentHeaderPDFHtml : undefined,
      footerTemplate: nameTemplateFooterPDF
        ? await fsPromise.readFile(
            path.join(
              process.cwd(),
              "app",
              "resources",
              "template",
              nameTemplateFooterPDF
            ),
            "utf-8"
          )
        : undefined,
      printBackground,
      margin: { top: top, bottom: bottom, left: left, right: right },
    });

    await browser.close();

    return bufferPDF;
  }

  async combinePDFs(PDFs: IReportCombinePDFs[]): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();

    for (const PDF of PDFs) {
      const PDFDoc = await PDFDocument.load(PDF.bufferFile);
      const copiedPages = await pdfDoc.copyPages(
        PDFDoc,
        PDFDoc.getPageIndices()
      );
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    const combinedBuffer = Buffer.from(await pdfDoc.save());
    return combinedBuffer;
  }
}
