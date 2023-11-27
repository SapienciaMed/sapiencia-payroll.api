import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
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
import { EDeductionTypes } from "App/Constants/PayrollGenerateEnum";

export interface IReportsRepository {
  getPayrollInformation(codPayroll: number): Promise<IFormPeriod | null>;
  getAllIncomesTypes(): Promise<IIncomeType[]>;
  getAllDeductionsTypes(): Promise<IDeductionType[]>;
  getAllReservesTypes(): Promise<IReserveType[]>;
  generateXlsx(rows: any): Promise<any>;
  generateWordReport(): Promise<any>;
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

  async getPayrollInformationEmployment(
    codPayroll: number,
    codEmployment: number
  ): Promise<IFormPeriod | null> {
    const res = await FormsPeriod.query()
      .preload("deductions", (deductionsQuery) => {
        deductionsQuery
          .where("idEmployment", codEmployment)
          .whereNot("idTypeDeduction", EDeductionTypes.dependentPeople)
          .whereNot("idTypeDeduction", EDeductionTypes.rentExempt)
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

  async generateWordReport(): Promise<any> {
    const table = new Table({
      columnWidths: [3505, 5505],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 3505,
                type: WidthType.DXA,
              },
              children: [new Paragraph("Hello")],
            }),
            new TableCell({
              width: {
                size: 5505,
                type: WidthType.DXA,
              },
              children: [],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 3505,
                type: WidthType.DXA,
              },
              children: [],
            }),
            new TableCell({
              width: {
                size: 5505,
                type: WidthType.DXA,
              },
              children: [new Paragraph("World")],
            }),
          ],
        }),
      ],
    });

    const table2 = new Table({
      columnWidths: [4505, 4505],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 4505,
                type: WidthType.DXA,
              },
              children: [new Paragraph("Hello")],
            }),
            new TableCell({
              width: {
                size: 4505,
                type: WidthType.DXA,
              },
              children: [],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 4505,
                type: WidthType.DXA,
              },
              children: [],
            }),
            new TableCell({
              width: {
                size: 4505,
                type: WidthType.DXA,
              },
              children: [new Paragraph("World")],
            }),
          ],
        }),
      ],
    });

    const table3 = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Hello")],
            }),
            new TableCell({
              children: [],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [],
            }),
            new TableCell({
              children: [new Paragraph("World")],
            }),
          ],
        }),
      ],
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "Table with skewed widths" }),
            table,
            new Paragraph({ text: "Table with equal widths" }),
            table2,
            new Paragraph({ text: "Table without setting widths" }),
            table3,
          ],
        },
      ],
    });

    // Guardar el documento en un archivo
    const buffer = await Packer.toBuffer(doc).then(async (buffer) => {
      await fsPromise.writeFile("document.docx", buffer);

      return buffer;
    });
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
    // browser = await puppeteer.launch({
    //   headless: "new",
    //   args: ["--no-sandbox"],
    //   executablePath: "/usr/bin/chromium",
    // });

    //Configuracion local proyecto
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
