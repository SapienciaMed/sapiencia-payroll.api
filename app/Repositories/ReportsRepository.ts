import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Header,
  Paragraph,
  TextRun,
  WidthType,
  PageNumber,
  ImageRun,
  AlignmentType,
  BorderStyle,
  VerticalAlign,
  HorizontalPositionAlign,
  Table,
  TableRow,
  TableCell,
} from "docx";

import puppeteer, { Browser } from "puppeteer";
import Handlebars from "handlebars";
import path from "path";
import fsPromise from "fs/promises";

import DeductionType from "App/Models/DeductionType";
import IncomeType from "App/Models/IncomeType";
import ReserveType from "App/Models/ReserveType";
import FormsPeriod from "App/Models/FormsPeriod";

import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import { IIncomeType } from "App/Interfaces/IncomeTypesInterfaces";
import { IReserveType } from "App/Interfaces/ReserveTypesInterfaces";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import * as fs from "fs/promises";
import { EPayrollTypes } from "App/Constants/PayrollGenerateEnum";
import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import Employment from "App/Models/Employment";
import { EPayrollState } from "App/Constants/States.enum";

export interface IReportsRepository {
  getPayrollInformation(codPayroll: number): Promise<IFormPeriod | null>;
  getAllIncomesTypes(): Promise<IIncomeType[]>;
  getAllDeductionsTypes(): Promise<IDeductionType[]>;
  getAllReservesTypes(): Promise<IReserveType[]>;
  generateXlsx(rows: any): Promise<any>;
  generateWordReport(doc: any): Promise<any>;
  generatePdf(
    nameTemplate: string,
    dataContentPDF: object,
    printBackground: boolean,
    nameCssFile?: string,
    nameTemplateHeaderPDF?: string,
    nameTemplateFooterPDF?: string
  ): Promise<Buffer>;
  getPayrollInformationEmployment(
    codPayroll: number,
    codEmployment: number
  ): Promise<IFormPeriod | null>;
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
      .preload("deductions")
      .preload("incomes")
      .preload("reserves")
      .preload("historicalPayroll", (history) => {
        history
          .where("idEmployment", codEmployment)
          .preload("employment", (employment) => {
            employment.preload("worker", (workerQuery) => {
              workerQuery.preload("relatives");
            });
          });
      })
      .where("year", year);

    if (!res) {
      return null;
    }

    return res.map((formPeriod) => formPeriod.serialize() as IFormPeriod);
  }

  async getPayrollInformationLiquidationYear(
    year: number,
    codEmployment: number
  ): Promise<IFormPeriod[] | null> {
    const res = await FormsPeriod.query()
      .preload("deductions")
      .preload("incomes")
      .preload("reserves")
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
      .andWhere("idFormType", EPayrollTypes.liquidation)
      .andWhere("state", EPayrollState.authorized);

    if (!res) {
      return null;
    }

    return res.map((formPeriod) => formPeriod.serialize() as IFormPeriod);
  }

  async getPayrollInformationContractsYear(
    year: number,
    codEmployment: number
  ): Promise<IEmployment[] | null> {
    const res = await Employment.query()
      .preload("worker")
      .preload("typesContracts")
      .where("id", codEmployment)
      .whereBetween("startDate", [
        new Date(`01/01/${year}`),
        new Date(`31/12/${year}`),
      ])
      .andWhereBetween("endDate", [
        new Date(`01/01/${year}`),
        new Date(`31/12/${year}`),
      ]);

    if (!res) {
      return null;
    }

    return res.map((formPeriod) => formPeriod.serialize() as IEmployment);
  }

  async getPayrollInformationEmployment(
    codPayroll: number,
    codEmployment: number
  ): Promise<IFormPeriod | null> {
    const res = await FormsPeriod.query()
      .preload("deductions", (deductionsQuery) => {
        deductionsQuery
          .where("idEmployment", codEmployment)
          .preload("deductionTypeOne");
      })
      .preload("incomes", (incomesQuery) => {
        incomesQuery.where("idEmployment", codEmployment).preload("incomeType");
      })
      .preload("reserves")
      .preload("historicalPayroll", (history) => {
        history
          .where("idEmployment", codEmployment)
          .whereNot("state", "Fallido")
          .preload("employment", (employment) => {
            employment.preload("worker");
            employment.preload("charge");
            employment.preload("dependence");
          });
      })
      .where("id", codPayroll)
      .first();

    if (!res) {
      return null;
    }

    return res.serialize() as IFormPeriod;
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
    nameTemplateHeaderPDF?: string,
    nameTemplateFooterPDF?: string
  ): Promise<Buffer> {
    const templateHtml = await fsPromise.readFile(
      path.join(process.cwd(), "app", "resources", "template", nameTemplate),
      "utf-8"
    );

    Handlebars.registerHelper("eq", (a, b) => a == b);

    const template = Handlebars.compile(templateHtml);

    const contentPDFHtml = template(dataContentPDF);

    let browser: Browser;

    //Configuracion para pruebas
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
      executablePath: "/usr/bin/chromium",
    });

    //Configuracion local proyecto
    // browser = await puppeteer.launch({
    //   headless: "new",
    //   // slowMo: 400,
    // });

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

    const bufferPDF = await page.pdf({
      format: "A4",
      displayHeaderFooter: !!nameTemplateHeaderPDF || !!nameTemplateFooterPDF,
      headerTemplate: nameTemplateHeaderPDF
        ? await fsPromise.readFile(
            path.join(
              process.cwd(),
              "app",
              "resources",
              "template",
              nameTemplateHeaderPDF
            ),
            "utf-8"
          )
        : undefined,
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
      margin: { top: 10, bottom: 30, left: 35, right: 35 },
    });

    await browser.close();

    return bufferPDF;
  }
}
