import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun } from "docx";
import puppeteer from "puppeteer";

import DeductionType from "App/Models/DeductionType";
import IncomeType from "App/Models/IncomeType";
import ReserveType from "App/Models/ReserveType";
import FormsPeriod from "App/Models/FormsPeriod";

import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import { IIncomeType } from "App/Interfaces/IncomeTypesInterfaces";
import { IReserveType } from "App/Interfaces/ReserveTypesInterfaces";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";

export interface IReportsRepository {
  getPayrollInformation(codPayroll: number): Promise<IFormPeriod | null>;
  getAllIncomesTypes(): Promise<IIncomeType[]>;
  getAllDeductionsTypes(): Promise<IDeductionType[]>;
  getAllReservesTypes(): Promise<IReserveType[]>;
  generateXlsx(rows: any): Promise<any>;
  generateWordReport(): Promise<any>;
  generatePdf(
    contentPDFHtml: string,
    headerAndFooter: boolean,
    headerPDFHtml?: string,
    footerPDFHtml?: string
  ): Promise<Buffer>;
  getPayrollInformationEmployment(
    codPayroll: number,
    codEmployment: number
  ): Promise<IFormPeriod | null>;
  getPayrollInformationYear(
    year: number,
    codEmployment: number
  ): Promise<IFormPeriod | null>;
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
  ): Promise<IFormPeriod | null> {
    const res = await FormsPeriod.query()
      .preload("deductions")
      .preload("incomes")
      .preload("reserves")
      .preload("historicalPayroll", (history) => {
        history.where("idEmployment", codEmployment),
          history.preload("employment", (employment) => {
            employment.preload("worker");
          });
      })
      .where("year", year)
      .first();

    if (!res) {
      return null;
    }

    return res.serialize() as IFormPeriod;
  }

  async getPayrollInformationEmployment(
    codPayroll: number,
    codEmployment: number
  ): Promise<IFormPeriod | null> {
    const res = await FormsPeriod.query()
      .preload("deductions")
      .preload("incomes")
      .preload("reserves")
      .preload("historicalPayroll", (history) => {
        history.where("idEmployment", codEmployment),
          history.preload("employment", (employment) => {
            employment.preload("worker");
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
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Reporte de ejemplo",
                  bold: true,
                  font: "Arial",
                }),
              ],
            }),
            // Puedes agregar más contenido según tus necesidades
          ],
        },
      ],
    });

    // Guardar el documento en un archivo
    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }

  async generatePdf(
    contentPDFHtml: string,
    headerAndFooter: boolean,
    headerPDFHtml?: string,
    footerPDFHtml?: string
  ): Promise<Buffer> {
    // Configuracion para pruebas
    // const browser = await puppeteer.launch({
    //   headless: "new",
    //   args: ["--no-sandbox"],
    //   executablePath: "/usr/bin/chromium",
    // });

    //Configuracion local proyecto
    const browser = await puppeteer.launch({
      headless: "new",
      //slowMo: 100,
    });

    const page = await browser.newPage();

    await page.setContent(contentPDFHtml, {
      waitUntil: "load",
    });

    await new Promise((r) => setTimeout(r, 1000));

    const bufferPDF = await page.pdf({
      format: "A4",
      displayHeaderFooter: headerAndFooter,
      headerTemplate: headerPDFHtml,
      footerTemplate: footerPDFHtml,
    });

    await browser.close();

    return bufferPDF;
  }
}
