export interface IReport {
  period: string;
  codEmployment: string;
  typeReport: number;
}

export interface IReportResponse {
  bufferFile: Buffer;
  nameFile: string;
}
