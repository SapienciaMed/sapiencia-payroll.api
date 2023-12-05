export interface IReport {
  period: number;
  codEmployment?: number;
  typeReport: number;
}

export interface IReportResponse {
  bufferFile: Buffer;
  nameFile: string;
}

export interface IDetailColillaPDF {
  name: string;
  type: string;
  days: string;
  value: string;
}

export interface IReportCombinePDFs {
  bufferFile: Buffer;
  name: string;
}
