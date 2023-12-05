import { formaterNumberToCurrency } from "App/Utils/functions";
import {
  Header,
  Paragraph,
  TextRun,
  WidthType,
  PageNumber,
  ImageRun,
  AlignmentType,
  VerticalAlign,
  Table,
  TableRow,
  TableCell,
  Footer,
  HeightRule,
} from "docx";
import * as fs from "fs";

interface IWordHeader {
  typeDocument: string;
  title: string;
  code: string;
  version: string;
  logo?: string;
}

interface IWordFooter {
  elaborated: {
    position: string;
    date: string;
  };
  revised: {
    position: string;
    date: string;
  };
  approved: {
    position: string;
    date: string;
  };
}

interface IWordSubTitle {
  text: string;
  bold?: boolean;
  size?: number;
}
interface IWordSubTitleDobleLine {
  text: "";
  textOne: string;
  boldOne?: boolean;
  sizeOne?: number;
  textTwo: string;
  boldTwo?: boolean;
  sizeTwo?: number;
}

interface IWordParagraph {
  text: string;
  bold?: boolean;
  size?: number;
}

interface IWordParagraphFirstBold {
  text: string;
  textOne: string;
  textTwo: string;
  bold?: boolean;
  size?: number;
}

interface ITableAprovedTrazability {
  text: string;
  nameTH: string;
  nameContador: string;
  nameAdministrativa: string;
  nameJuridica: string;
  nameFinanciera: string;
  nameJefeJuridica: string;
}

interface ITableVacationResolution {
  text: string;
  totalEnjoyedDays: number;
  starDateEnjoyedDays: string;
  nextBussinesDay: string;
  salary: number;
  salaryPaid: number;
  startPayroll: string;
  endPayroll: string;
  bonusVacation: number;
  recreationBounty: number;
  deductionlegal: number;
  totalPaid: number;
  size?: number;
}

interface ISettlementOfSocialBenefits {
  fechaResolucion: string;
  valorTotalResolucion: string;
  nombre: string;
  noDocumento: string;
  fechaIngreso: string;
  fechaRetiro: string;
  diasCesantias: string;
  diasInteresesCesantias: string;
  diasPrimaNavidad: string;
  diasVacionesYPrimaVacaciones: string;
  diasBonificacionServicios: string;
  diasPrimaServicio: string;
  cesantias: string;
  interesesCesantias: string;
  vacaciones: string;
  bonificacionRecreacion: string;
  primaNavidad: string;
  bonificacionServicios: string;
  primaServicios: string;
  salarios: string;
  aportesSeguridadSocial: string;
  aportesAFC: string;
  retencionFuenteRenta: string;
  totalPagarPrestacionesSociales: string;
}

interface ITablePerContract {
  noContrato: string;
  objeto: string;
  obligacionesContractuales: IItemContractualObligation[];
  valorContrato: string;
  fechaInicio: string;
  fechaTerminacion: string;
  lugarEjecucion: string;
  cumplimiento: string;
  sanciones: string;
}

interface IItemContractualObligation {
  text: string;
}

interface ILogosOnly {
  logo: any;
}

interface IUniversityProfessional {
  name: string;
  size?: number;
}

export class ComponentsWord {
  async generateHeader(data: IWordHeader): Promise<any> {
    return new Header({
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              height: { value: 500, rule: HeightRule.EXACT },
              children: [
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  rowSpan: 2,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new ImageRun({
                          data: fs.readFileSync(
                            `./app/resources/img/${data.logo}`
                          ),
                          transformation: {
                            height: 80,
                            width: 80,
                          },
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 40, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                  rowSpan: 2,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: data.typeDocument,
                          font: "Arial",
                          size: 20,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Código: ${data.code}`,
                          bold: false,
                          font: "Arial",
                          size: 20,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Version: ${data.version}`,
                          bold: false,
                          font: "Arial",
                          size: 20,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              height: { value: 500, rule: HeightRule.EXACT },
              children: [
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  columnSpan: 2,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: data.title,
                          bold: true,
                          font: "Arial",
                          size: 20,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  verticalAlign: VerticalAlign.CENTER,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          size: 20,
                          font: "Arial",
                          children: [
                            "Página: ",
                            PageNumber.CURRENT,
                            " de ",
                            PageNumber.TOTAL_PAGES,
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({
          spacing: {
            after: 200, // Ajusta el valor según tus necesidades
          },
        }),
      ],
    });
  }

  async generateFooter(data: IWordFooter): Promise<any> {
    return new Footer({
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Elaboró: ${data.elaborated.position} `,
                          bold: false,
                          font: "Arial",
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Revisó: ${data.revised.position}`,
                          bold: false,
                          font: "Arial",
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Aprobó: ${data.approved.position}`,
                          bold: false,
                          font: "Arial",
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Fecha: ${data.elaborated.date}`,
                          bold: false,
                          font: "Arial",
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Fecha: ${data.revised.date}`,
                          bold: false,
                          font: "Arial",
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: `Fecha: ${data.approved.date}`,
                          bold: false,
                          font: "Arial",
                          size: 18,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  async subTitle(data: IWordSubTitle): Promise<any> {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: data.text,
          bold: data.bold ?? true,
          font: "Arial",
          size: data.size ?? 22,
        }),
      ],
      spacing: {
        before: 400, // Espacio antes del párrafo en unidades twips
        after: 400, // Espacio después del párrafo en unidades twips
      },
    });
  }

  async subTitleDoubleLine(data: IWordSubTitleDobleLine): Promise<any> {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: data.textOne,
          bold: data.boldOne ?? true,
          font: "Arial",
          size: data.sizeOne ?? 22,
          break: 1,
        }),
        new TextRun({
          text: data.textTwo,
          bold: data.boldTwo ?? true,
          font: "Arial",
          size: data.sizeTwo ?? 22,
          break: 1,
        }),
      ],
      spacing: {
        before: 400, // Espacio antes del párrafo en unidades twips
        after: 400, // Espacio después del párrafo en unidades twips
      },
    });
  }

  async generateParagraph(data: IWordParagraph): Promise<any> {
    return new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: data.text,
          bold: data.bold ?? false,
          font: "Arial",
          size: data.size ?? 22,
        }),
      ],
      spacing: {
        before: 200, // Espacio antes del párrafo en unidades twips
        after: 200, // Espacio después del párrafo en unidades twips
      },
    });
  }

  async generateParagraphWithInitialBold(
    data: IWordParagraphFirstBold
  ): Promise<any> {
    return new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: data.textOne,
          bold: true,
          font: "Arial",
          size: data.size ?? 22,
        }),
        new TextRun({
          text: data.textTwo == "" ? data.text : data.textTwo,
          bold: false,
          font: "Arial",
          size: data.size ?? 20,
        }),
      ],
      spacing: {
        before: 200, // Espacio antes del párrafo en unidades twips
        after: 200, // Espacio después del párrafo en unidades twips
      },
    });
  }

  async generateTableVacationResolution(
    data: ITableVacationResolution
  ): Promise<any> {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Días de disfrute`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${data.totalEnjoyedDays}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Fecha de Inicio`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${data.starDateEnjoyedDays}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Fecha de reintegro`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${data.nextBussinesDay}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Salario base: Vacaciones y prima de vacaciones`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${formaterNumberToCurrency(data.salary)}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Vacaciones`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${formaterNumberToCurrency(data.bonusVacation)}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Bonificación por recreación`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${formaterNumberToCurrency(
                        data.recreationBounty
                      )}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Salarios ${data.startPayroll} A ${data.endPayroll}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${formaterNumberToCurrency(data.salaryPaid)}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Deducciones`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: ``,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Aportes obligatorios`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "",
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Pensión, salud y fondos de pensiones`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${formaterNumberToCurrency(data.deductionlegal)}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Total a pagar`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `${formaterNumberToCurrency(data.totalPaid)}`,
                      bold: false,
                      font: "Arial",
                      size: data.size ?? 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }
  async generateDocumentTraceabilityAproved(
    data: ITableAprovedTrazability
  ): Promise<any> {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Proyectó: Profesional Universitaria - Talento Humano`,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Revisó: Profesional Universitaria - Contabilidad`,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Revisó: Abogado - contratista Sub Administrativa`,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Revisó: Abogada – Contratista. Oficina Asesora Jurídica`,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Aprobó: Subdirectora Administrativa -Financiera y de Apoyo a la Gestión`,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Aprobó: Jefe Oficina  -Asesora Jurídica`,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              margins: {
                top: 200, // Ajusta el valor según tus necesidades
                bottom: 200, // Ajusta el valor según tus necesidades
              },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: ``,
                      bold: false,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: ``,
                      bold: false,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: ``,
                      bold: false,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: ``,
                      bold: false,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: ``,
                      bold: false,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: ``,
                      bold: false,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: data.nameTH,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: data.nameContador,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: data.nameAdministrativa,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: data.nameJuridica,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: data.nameFinanciera,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: data.nameJefeJuridica,
                      bold: false,
                      font: "Arial",
                      size: 12,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  async generateSettlementOfSocialBenefits(
    data: ISettlementOfSocialBenefits
  ): Promise<any> {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "LIQUIDACIÓN PRESTACIONES SOCIALES",
                      bold: true,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "N° Resolución",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Fecha Resolución",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.fechaResolucion,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Valor Total Resolución",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${data.valorTotalResolucion}`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Nombre",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.nombre,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "N° de Cédula",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.noDocumento,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Fecha de ingreso",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.fechaIngreso,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Fecha de Retiro",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.fechaRetiro,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Días Cesantías",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.diasCesantias,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Días Intereses Cesantías",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.diasInteresesCesantias,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Días Prima de Navidad",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.diasPrimaNavidad,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Días Vacaciones y Prima de Vacaciones",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.diasVacionesYPrimaVacaciones,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Días bonificación por servicios",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.diasBonificacionServicios,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Días prima de servicio",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.diasPrimaServicio,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "CESANTIAS",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "SALARIO MENSUAL * DÍAS LABORADOS ",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${data.cesantias}`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "360",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "INTERESES CESANTIAS",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "CESANTÍAS * DÍAS LABORADOS * 0.12 ",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${data.interesesCesantias}`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "360",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "VACACIONES",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "SALARIO MENSUAL BÁSICO * DÍAS LABORADOS",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${data.vacaciones}`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "720",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "BONIFICACIÓN POR RECREACIÓN",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "SALARIO MENSUAL BÁSICO * 2",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${data.bonificacionRecreacion}`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "30",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "PRIMA DE NAVIDAD",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "SALARIO MENSUAL BÁSICO * DÍAS LABORADOS",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${data.primaNavidad}`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "360",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "BONIFICACIÓN POR SERVICIOS",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "SALARIO MENSUAL BÁSICO * 2",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${data.bonificacionServicios}`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "360",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "PRIMA DE SERVICIOS",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "SALARIO MENSUAL BÁSICO * DÍAS LABORADOS",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${data.primaServicios}`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "720",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "SALARIOS",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "SALARIO MENSUAL BÁSICO * DÍAS LABORADOS",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `${data.salarios}`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "30",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "DEDUCCIONES",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "APORTES SEGURIDAD SOCIAL",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: `(${data.aportesSeguridadSocial})`,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "APORTES AFC",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.aportesAFC,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "RETENCIÓN EN LA FUENTE POR RENTA",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: "",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.retencionFuenteRenta,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 3,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "TOTAL A PAGAR LIQUIDACIÓN DE PRESTACIONES SOCIALES",
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: data.totalPagarPrestacionesSociales,
                      bold: false,
                      font: "Arial",
                      size: 22,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  async generateTablePerContract(data: ITablePerContract): Promise<any> {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  indent: { left: 141.75 /* , right: 920 */ },
                  children: [
                    new TextRun({
                      text: "N° de contrato",
                      bold: true,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: data.noContrato,
                      bold: false,
                      size: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  indent: { left: 141.75 /* , right: 920 */ },
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Objeto",
                      bold: true,
                      size: 20,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: data.objeto,
                      bold: false,
                      size: 18,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  indent: { left: 141.75 /* , right: 920 */ },
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Obligaciones contractuales",
                      bold: false,
                      size: 20,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: data.obligacionesContractuales.map(
                (item: any) =>
                  new Paragraph({
                    alignment: AlignmentType.JUSTIFIED,
                    children: [
                      new TextRun({
                        text: `${item.text}`,
                        bold: false,
                        size: 18,
                        font: "Arial",
                      }),
                    ],
                  })
              ),
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  indent: { left: 141.75 /* , right: 920 */ },
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Valor del contrato",
                      bold: true,
                      size: 20,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: data.valorContrato,
                      bold: false,
                      size: 18,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  indent: { left: 141.75 /* , right: 920 */ },
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Fecha de Inicio",
                      bold: true,
                      size: 20,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: data.fechaInicio,
                      bold: false,
                      size: 18,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  indent: { left: 141.75 /* , right: 920 */ },
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Fecha de Terminación",
                      bold: true,
                      size: 20,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: data.fechaTerminacion,
                      bold: false,
                      size: 18,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  indent: { left: 141.75 /* , right: 920 */ },
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Cumplimiento",
                      bold: true,
                      size: 20,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  indent: { left: 141.75 /* , right: 920 */ },
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: data.cumplimiento,
                      bold: false,
                      size: 18,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  indent: { left: 141.75 /* , right: 920 */ },
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Lugar de ejecución",
                      bold: true,
                      size: 20,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: data.lugarEjecucion,
                      bold: false,
                      size: 18,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  indent: { left: 141.75 /* , right: 920 */ },
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: "Sanciones",
                      bold: true,
                      size: 20,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  children: [
                    new TextRun({
                      text: data.sanciones,
                      bold: false,
                      size: 18,
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  async getHeaderLogoOnly(data: ILogosOnly): Promise<any> {
    return new Header({
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new ImageRun({
              data: fs.readFileSync(`./app/resources/img/${data.logo}`),
              transformation: {
                width: 200,
                height: 100,
              },
            }),
          ],
        }),
        new Paragraph({
          spacing: {
            after: 200, // Ajusta el valor según tus necesidades
          },
        }),
      ],
    });
  }

  async getFooterLogoOnly(data: ILogosOnly): Promise<any> {
    return new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new ImageRun({
              data: fs.readFileSync(`./app/resources/img/${data.logo}`),
              transformation: {
                width: 150,
                height: 100,
              },
            }),
          ],
        }),
      ],
    });
  }

  async getComponentFirm(data: IUniversityProfessional): Promise<any> {
    return new Paragraph({
      spacing: {
        before: 1400,
      },
      indent: { left: 2020 /* , right: 920 */ }, // La indentación se mide en twips (1 pulgada = 1440 twips)
      children: [
        new TextRun({
          text: data.name,
          bold: true,
          font: "Arial",
          size: data.size ?? 18,
          break: 1,
        }),
        new TextRun({
          text: "Profesional Universitario-Gestión Humana",
          bold: false,
          font: "Arial",
          size: 18,
          break: 1,
        }),
        new TextRun({
          text: "Subdirección Administrativa, financiera y de apoyo a la gestión",
          bold: false,
          font: "Arial",
          size: 18,
          break: 1,
        }),
        new TextRun({
          text: "Teléfono: (4) 4447947",
          bold: false,
          font: "Arial",
          size: 18,
          break: 1,
        }),
        new TextRun({
          text: "Correo electrónico:",
          bold: false,
          font: "Arial",
          size: 18,
          break: 1,
        }),
        new TextRun({
          text: "gestionhumana@sapiencia.gov.co",
          bold: false,
          font: "Arial",
          size: 18,
          style: "Hyperlink",
        }),
      ],
    });
  }
}
