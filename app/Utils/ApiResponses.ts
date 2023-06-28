import { EResponseCodes } from "App/Constants/ResponseCodesEnum";

interface IOperation {
  code: EResponseCodes;
  message?: string;
}

interface IDataPaging {
  total: number;
  perPage?: number;
  currentPage?: number;
  lastPage?: number;
  firstPage?: number;
  firstPageUrl?: string;
  lastPageUrl?: string;
  nextPageUrl?: string;
  previousPageUrl?: string;
}

export interface IPagingData<T> {
  array: T[];
  meta: IDataPaging;
}

export class ApiResponse<T> {
  data: T;
  operation: IOperation;

  constructor(data: T, code: EResponseCodes, message?: string) {
    this.data = data;
    this.operation = { code, message };
  }
}
