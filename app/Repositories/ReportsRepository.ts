import { IDeductionType } from "App/Interfaces/DeductionsTypesInterface";
import * as XLSX from "xlsx";
import { IIncomeType } from "App/Interfaces/IncomeTypesInterfaces";
import { IReserveType } from "App/Interfaces/ReserveTypesInterfaces";
import DeductionType from "App/Models/DeductionType";
import IncomeType from "App/Models/IncomeType";
import ReserveType from "App/Models/ReserveType";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import FormsPeriod from "App/Models/FormsPeriod";

export interface IReportsRepository {
  getPayrollInformation(codPayroll: number): Promise<IFormPeriod | null>;
  getAllIncomesTypes(): Promise<IIncomeType[]>;
  getAllDeductionsTypes(): Promise<IDeductionType[]>;
  getAllReservesTypes(): Promise<IReserveType[]>;
  generateXlsx(rows: any): Promise<any>;
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
}
