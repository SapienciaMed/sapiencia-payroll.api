import { ComponentsWord } from "./ComponentsWord";
import { Document } from "docx";
import writtenNumber from "written-number";
import {
  EDeductionTypes,
  EIncomeTypes,
} from "App/Constants/PayrollGenerateEnum";
import { IVacationDay } from "App/Interfaces/VacationDaysInterface";
import { getNextBusinessDay } from "App/Utils/functions";

export class VacationResolution {
  async generateReport(
    data: IVacationDay[] | null,
    param: { firstParam: string; secondParam: string; thirdParam: string }
  ): Promise<any> {
    const documentTypeMapping = {
      CC: "Cédula de Ciudadanía",
      CE: "Cédula de Extranjería",
      TI: "Tarjeta de Identidad",
      NIT: "NIT",
      AN: "Anónimo",
    };
    const componentsWord = new ComponentsWord();
    const {
      subTitle,
      generateParagraph,
      generateFooter,
      generateHeader,
      subTitleDoubleLine,
      generateParagraphWithInitialBold,
      generateDocumentTraceabilityAproved,
      generateTableVacationResolution,
    } = componentsWord;

    const replacePlaceholders = (text: string, placeholders: any[]) => {
      let modifiedText = text;
      placeholders.forEach((placeholder) => {
        modifiedText = modifiedText.replace(
          placeholder.key,
          placeholder.newText
        );
      });
      return modifiedText;
    };

    const dataContentReport = [
      {
        consecutive: 1,
        componentWordProp: subTitle.bind({
          text: "",
          textOne: "",
          textTwo: "",
          size: 22,
        }),
        argumentsComponent: {
          text: `${data?.[0].observation}`,
          bold: false,
          size: 22,
        },
        placeholders: [
          {
            key: "[Observaciones de vacaciones]",
            newText: "cualquier cosa",
          },
        ],
      },
      {
        consecutive: 2,
        componentWordProp: subTitle.bind({ text: "", size: 22 }),
        argumentsComponent: {
          text: "POR LA CUAL SE CONCEDEN VACACIONES A UN SERVIDOR PUBLICO DE LA ENTIDAD",
          bold: false,
          size: 22,
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
      {
        consecutive: 3,
        componentWordProp: generateParagraph.bind({ text: "", size: 22 }),
        argumentsComponent: {
          text: `${param.firstParam}`,
          size: 22,
        },
        placeholders: [
          {
            key: "[parametro1]",
            newText:
              "El Director General de la Agencia de Educación postsecundaria de Medellín- SAPIENCIA, en uso de sus facultades legales, en especial las conferidas por el Decreto Municipal N° 1364 de 2012, y el Acuerdo Directivo 003 de 2013 y Acuerdo Directivo 014 de 2015, modificados por el Acuerdo Directivo 29 de 2021- Por el cual se expide el Estatuto General de la Agencia de Educación Postsecundaria de Medellín- Sapiencia, y",
          },
        ],
      },
      {
        consecutive: 4,
        componentWordProp: subTitle.bind({ text: "", size: 22 }),
        argumentsComponent: {
          text: "CONSIDERANDO QUE:",
          bold: true,
          size: 22,
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
      {
        consecutive: 5,
        componentWordProp: generateParagraph.bind({ text: "", size: 22 }),
        argumentsComponent: {
          text: `${
            data?.[0].vacation?.employment?.worker?.gender == "H"
              ? "El servidor"
              : data?.[0].vacation?.employment?.worker?.gender == "M"
              ? "La servidora"
              : "L@ servidor@"
          } ${
            data?.[0].vacation?.employment?.worker?.firstName +
            " " +
            data?.[0].vacation?.employment?.worker?.secondName +
            " " +
            data?.[0].vacation?.employment?.worker?.surname +
            " " +
            data?.[0].vacation?.employment?.worker?.secondSurname
          } ${
            data?.[0].vacation?.employment?.worker?.gender == "H"
              ? "identificado"
              : data?.[0].vacation?.employment?.worker?.gender == "M"
              ? "identificada"
              : "identificad@"
          } con ${
            documentTypeMapping[
              data?.[0].vacation?.employment?.worker?.typeDocument ?? "CC"
            ]
          }, número ${
            data?.[0].vacation?.employment?.worker?.numberDocument
          }, quien se desempeña como ${
            data?.[0].vacation?.employment?.charge?.name
          } - ${
            data?.[0].vacation?.employment?.dependence?.name
          } de la Agencia de Educación Postsecundaria de Medellín-Sapiencia, mediante ${
            data?.length ?? 0 > 0
              ? "de los oficios radicados internos"
              : "oficio radicado interno"
          } ${data
            ?.map((vacation) => {
              if (!vacation.paid) {
                return `${vacation.observation}`;
              } else {
                return "";
              }
            })
            .join(",")} solicita vacaciones ${
            data?.length ?? 0 > 0
              ? "de los períodos comprendidos"
              : "del período comprendido"
          } entre ${data
            ?.map((vacation) => {
              if (!vacation.paid) {
                return `${new Date(
                  vacation.dateFrom.toString() ?? new Date().toString()
                ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
                  month: "long",
                }).format(
                  new Date(
                    vacation.dateFrom.toString() ?? new Date().toString()
                  )
                )} ${new Date(
                  vacation.dateFrom.toString() ?? new Date().toString()
                ).getFullYear()} y ${new Date(
                  vacation.dateUntil?.toString() ?? new Date().toString()
                ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
                  month: "long",
                }).format(
                  new Date(
                    vacation.dateUntil?.toString() ?? new Date().toString()
                  )
                )} ${new Date(
                  vacation.dateUntil?.toString() ?? new Date().toString()
                ).getFullYear()}`;
              } else {
                return "";
              }
            })
            .join(" y ")}`,
          size: 22,
        },
        placeholders: [
          {
            key: "[apelativo]",
            newText: "apelativo",
          },
          {
            key: "[nombre completo]",
            newText: "jacinto jose pelaez",
          },
          {
            key: "[nombre tipo documento]",
            newText: "cedula de ciudadania",
          },
          {
            key: "[numero documento]",
            newText: "123456789",
          },
          {
            key: "[cargo]",
            newText: "secretaria",
          },
          {
            key: "[dependencia]",
            newText: "financiera",
          },
          {
            key: "[observaciones vacaciones]",
            newText: "observacion 1",
          },
          {
            key: "[fecha inicial del periodo a pagar]",
            newText: "01 de enero 2023",
          },
          {
            key: "[fecha fin del periodo a pagar]",
            newText: "31 de diciembre 2023",
          },
        ],
      },
      {
        consecutive: 6,
        componentWordProp: generateParagraph.bind({ text: "", size: 22 }),
        argumentsComponent: {
          text: `El tiempo para el disfrute de vacaciones del referido período lo solicitó a partir del ${data
            ?.map((vacation) => {
              if (!vacation.paid) {
                return `${new Date(
                  vacation.dateFrom.toString() ?? new Date().toString()
                ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
                  month: "long",
                }).format(
                  new Date(
                    vacation.dateFrom.toString() ?? new Date().toString()
                  )
                )} ${new Date(
                  vacation.dateFrom.toString() ?? new Date().toString()
                ).getFullYear()} y hasta el ${new Date(
                  vacation.dateUntil?.toString() ?? new Date().toString()
                ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
                  month: "long",
                }).format(
                  new Date(
                    vacation.dateUntil?.toString() ?? new Date().toString()
                  )
                )} ${new Date(
                  vacation.dateUntil?.toString() ?? new Date().toString()
                ).getFullYear()}, ambas fechas inclusive.`;
              } else {
                return "";
              }
            })
            .join(" y ")}`,
          size: 22,
        },
        placeholders: [
          {
            key: "[fecha inicial de los días disfrutados]",
            newText: "10 de noviembre 2023",
          },
          {
            key: "[fecha fin de los días disfrutados]",
            newText: "15 de noviembre 2023",
          },
        ],
      },
      {
        consecutive: 7,
        componentWordProp: generateParagraph.bind({ text: "", size: 22 }),
        argumentsComponent: {
          text: `${param.secondParam}`,
          size: 22,
        },
        placeholders: [
          {
            key: "[parametro2]",
            newText:
              "El artículo 8 del Decreto 1045 de 1978 que regula las vacaciones para los empleados públicos y trabajadores oficiales, señala: “Los empleados públicos y trabajadores oficiales tienen derecho a quince (15) días hábiles de vacaciones por cada año de servicios, salvo lo que se disponga en normas o estipulaciones especiales”.",
          },
        ],
      },
      {
        consecutive: 8,
        componentWordProp: generateParagraph.bind({ text: "", size: 22 }),
        argumentsComponent: {
          text: "En mérito de lo expuesto,",
          size: 22,
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
      {
        consecutive: 9,
        componentWordProp: subTitle.bind({ text: "", size: 22 }),
        argumentsComponent: {
          text: "RESUELVE",
          bold: true,
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
      {
        consecutive: 10,
        componentWordProp: generateParagraphWithInitialBold.bind({
          text: "",
          size: 22,
        }),
        argumentsComponent: {
          text: "",
          textOne: "ARTÍCULO PRIMERO: ",
          textTwo: `Conceder vacaciones a ${
            data?.[0].vacation?.employment?.worker?.gender == "H"
              ? "El servidor"
              : data?.[0].vacation?.employment?.worker?.gender == "M"
              ? "La servidora"
              : "L@ servidor@"
          } ${
            data?.[0].vacation?.employment?.worker?.firstName +
            " " +
            data?.[0].vacation?.employment?.worker?.secondName +
            " " +
            data?.[0].vacation?.employment?.worker?.surname +
            " " +
            data?.[0].vacation?.employment?.worker?.secondSurname
          } ${
            data?.[0].vacation?.employment?.worker?.gender == "H"
              ? "identificado"
              : data?.[0].vacation?.employment?.worker?.gender == "M"
              ? "identificada"
              : "identificad@"
          }  con ${
            documentTypeMapping[
              data?.[0].vacation?.employment?.worker?.typeDocument ?? "CC"
            ]
          }, número ${
            data?.[0].vacation?.employment?.worker?.numberDocument
          }, por el término de ${writtenNumber(
            Number(
              data?.reduce((sum, i) => sum + Number(i.enjoyedDays), 0) ?? 0
            ),
            { lang: "es" }
          )} (${Number(
            data?.reduce((sum, i) => sum + Number(i.enjoyedDays), 0) ?? 0
          )}) ${data
            ?.map((vacation) => {
              if (!vacation.paid) {
                const reintegrationDay = getNextBusinessDay(vacation.dateUntil);
                return `días hábiles contados a partir del día ${new Date(
                  vacation.dateFrom.toString() ?? new Date().toString()
                ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
                  month: "long",
                }).format(
                  new Date(
                    vacation.dateFrom.toString() ?? new Date().toString()
                  )
                )} ${new Date(
                  vacation.dateFrom.toString() ?? new Date().toString()
                ).getFullYear()}, hasta el ${new Date(
                  vacation.dateUntil?.toString() ?? new Date().toString()
                ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
                  month: "long",
                }).format(
                  new Date(
                    vacation.dateUntil?.toString() ?? new Date().toString()
                  )
                )} ${new Date(
                  vacation.dateUntil?.toString() ?? new Date().toString()
                ).getFullYear()} reintegrándose a sus labores el ${new Date(
                  reintegrationDay.toString() ?? new Date().toString()
                ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
                  month: "long",
                }).format(
                  new Date(reintegrationDay.toString() ?? new Date().toString())
                )} ${new Date(
                  reintegrationDay.toString() ?? new Date().toString()
                ).getFullYear()}`;
              } else {
                return "";
              }
            })
            .join(",")} ,`,
          size: 22,
        },
        placeholders: [
          {
            key: "[apelativo]",
            newText: "apelativo",
          },
          {
            key: "[nombre completo]",
            newText: "josefo ramirez",
          },
          {
            key: "[nombre tipo documento]",
            newText: "cedula de ciudadania",
          },
          {
            key: "[numero documento]",
            newText: "123456789",
          },
          {
            key: "[total de dias a disfrutar en letras]",
            newText: "seis",
          },
          {
            key: "[total de dias a disfrutar en numero]",
            newText: "6",
          },
          {
            key: "[fecha inicial de los dias disfrutados]",
            newText: "10 de noviembre 2023",
          },
          {
            key: "[fecha fin de los dias disfrutados]",
            newText: "15 de noviembre 2023",
          },
          {
            key: " [dia habil]",
            newText: "16 de noviembre 2023",
          },
        ],
      },
      {
        consecutive: 11,
        componentWordProp: generateParagraphWithInitialBold.bind({
          text: "",
          size: 22,
        }),
        argumentsComponent: {
          text: "",
          textOne: "ARTÍCULO SEGUNDO: ",
          textTwo: `Liquidar, por concepto de vacaciones otorgadas a ${
            data?.[0].vacation?.employment?.worker?.firstName +
            " " +
            data?.[0].vacation?.employment?.worker?.secondName +
            " " +
            data?.[0].vacation?.employment?.worker?.surname +
            " " +
            data?.[0].vacation?.employment?.worker?.secondSurname
          } ${
            data?.[0].vacation?.employment?.worker?.gender == "H"
              ? "identificado"
              : data?.[0].vacation?.employment?.worker?.gender == "M"
              ? "identificada"
              : "identificad@"
          }  con ${
            documentTypeMapping[
              data?.[0].vacation?.employment?.worker?.typeDocument ?? "CC"
            ]
          }, número ${
            data?.[0].vacation?.employment?.worker?.numberDocument
          }, los siguientes rubros:`,
          size: 22,
        },
        placeholders: [
          {
            key: "[nombre completo]",
            newText: "josefo ramirez",
          },
          {
            key: "[nombre tipo documento]",
            newText: "cedula de ciudadania",
          },
          {
            key: "[numero documento]",
            newText: "123456789",
          },
        ],
      },
      {
        consecutive: 12,
        componentWordProp: generateTableVacationResolution.bind({
          text: "",
          size: 22,
        }),
        argumentsComponent: {
          text: "",
          totalEnjoyedDays: `${Number(
            data?.reduce((sum, i) => sum + Number(i.enjoyedDays), 0) ?? 0
          )}`,
          starDateEnjoyedDays: `${data?.map((vacation) => {
            if (!vacation.paid) {
              return `${new Date(
                vacation.dateFrom.toString() ?? new Date().toString()
              ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
                month: "long",
              }).format(
                new Date(vacation.dateFrom.toString() ?? new Date().toString())
              )} ${new Date(
                vacation.dateFrom.toString() ?? new Date().toString()
              ).getFullYear()}`;
            } else {
              return "";
            }
          })}`,
          nextBussinesDay: `${data?.map((vacation) => {
            if (!vacation.paid) {
              const reintegrationDay = getNextBusinessDay(vacation.dateUntil);
              return `${new Date(
                reintegrationDay.toString() ?? new Date().toString()
              ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
                month: "long",
              }).format(
                new Date(reintegrationDay.toString() ?? new Date().toString())
              )} ${new Date(
                reintegrationDay.toString() ?? new Date().toString()
              ).getFullYear()}`;
            } else {
              return "";
            }
          })}`,
          salary: data?.[0].formPeriod?.historicalPayroll?.[0].salary,
          salaryPaid: data?.[0].formPeriod?.historicalPayroll?.[0].salary,
          startPayroll: `${new Date(
            data?.[0].formPeriod?.dateStart.toString() ?? new Date().toString()
          ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
            month: "long",
          }).format(
            new Date(
              data?.[0].formPeriod?.dateStart.toString() ??
                new Date().toString()
            )
          )} ${new Date(
            data?.[0].formPeriod?.dateStart.toString() ?? new Date().toString()
          ).getFullYear()}`,
          endPayroll: `${new Date(
            data?.[0].formPeriod?.dateEnd.toString() ?? new Date().toString()
          ).getDate()} de ${new Intl.DateTimeFormat("es-ES", {
            month: "long",
          }).format(
            new Date(
              data?.[0].formPeriod?.dateEnd.toString() ?? new Date().toString()
            )
          )} ${new Date(
            data?.[0].formPeriod?.dateEnd.toString() ?? new Date().toString()
          ).getFullYear()}`,
          bonusVacation: data?.[0].formPeriod?.incomes?.find(
            (i) => i.idTypeIncome == EIncomeTypes.primaVacations
          )?.value,
          recreationBounty: data?.[0].formPeriod?.incomes?.find(
            (i) => i.idTypeIncome == EIncomeTypes.bonusRecreation
          )?.value,
          deductionlegal: data?.[0]?.formPeriod?.deductions?.reduce(
            (sum, deduction) => {
              const isSocialSecurityOrRetirementFund =
                deduction?.idTypeDeduction === EDeductionTypes.SocialSecurity ||
                deduction.idTypeDeduction === EDeductionTypes.retirementFund;

              return (
                sum +
                (isSocialSecurityOrRetirementFund ? Number(deduction.value) : 0)
              );
            },
            0
          ),
          totalPaid: data?.[0].formPeriod?.historicalPayroll?.[0].total,
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
      {
        consecutive: 13,
        componentWordProp: generateParagraphWithInitialBold.bind({
          text: "",
          size: 22,
        }),
        argumentsComponent: {
          text: "",
          textOne: "PARÁGRAFO: ",
          textTwo:
            "Esta liquidación puede estar sujeta a retención en la fuente por renta.",
          size: 22,
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
      {
        consecutive: 14,
        componentWordProp: generateParagraphWithInitialBold.bind({
          text: "",
          size: 22,
        }),
        argumentsComponent: {
          text: "",
          textOne: "ARTÍCULO TERCERO: ",
          textTwo:
            "Remitir copia de la presente Resolución a la Subdirección Administrativa, Financiera y de Apoyo a la Gestión para lo de su competencia y copia a la hoja de vida del servidor.",
          size: 22,
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
      {
        consecutive: 15,
        componentWordProp: generateParagraphWithInitialBold.bind({
          text: "",
          size: 22,
        }),
        argumentsComponent: {
          text: "",
          textOne: "ARTÍCULO CUARTO: ",
          textTwo:
            "La presente Resolución rige a partir de la fecha de su expedición y contra la misma no procede ningún recurso.",
          size: 22,
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
      {
        consecutive: 16,
        componentWordProp: subTitle.bind({ text: "", size: 22 }),
        argumentsComponent: {
          text: "COMUNÍQUESE Y CÚMPLASE",
          bold: true,
          size: 22,
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
      {
        consecutive: 17,
        componentWordProp: subTitleDoubleLine.bind({
          text: "",
          textOne: "",
          textTwo: "",
          sizeOne: 22,
          sizeTwo: 22,
        }),
        argumentsComponent: {
          text: "",
          textOne: `${param.thirdParam}`,
          textTwo: "Director General ",
          boldTwo: false,
          sizeOne: 22,
          sizeTwo: 22,
        },
        placeholders: [
          {
            key: "[parametro3]",
            newText: "CARLOS ALBERTO CHAPARRO SÁNCHEZ",
          },
        ],
      },
      {
        consecutive: 18,
        componentWordProp: generateDocumentTraceabilityAproved.bind({
          text: "",
        }),
        argumentsComponent: {
          text: "",
          nameTH: "Nombre 1",
          nameContador: "Nombre 2",
          nameAdministrativa: "Nombre 3",
          nameJuridica: "Nombre 4",
          nameFinanciera: "Nombre 5",
          nameJefeJuridica: "Nombre 6",
        },
        placeholders: [
          {
            key: "",
            newText: "",
          },
        ],
      },
    ];

    const content = dataContentReport.map(async (item: any) => {
      const { componentWordProp, argumentsComponent, placeholders } = item;
      // Realiza la sustitución de placeholders en el texto
      const modifiedText = replacePlaceholders(
        argumentsComponent.text,
        placeholders
      );
      // Ajusta dinámicamente los argumentos utilizando argumentsComponent
      const modifiedComponentWord = await componentWordProp({
        ...argumentsComponent,
        text: modifiedText,
      });
      return await modifiedComponentWord;
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          headers: {
            default: await generateHeader({
              title: "ACTO ADMINISTRATIVO",
              typeDocument: "FORMATO",
              code: "F-AP-GJ-011",
              version: "2",
              logo: "logoSapiencia.png",
            }),
          },
          footers: {
            default: await generateFooter({
              elaborated: {
                position: "Profesional de Apoyo Jurídico",
                date: "12 de diciembre de 2016",
              },
              revised: {
                position: "Jefe Oficina Jurídica",
                date: "12 de diciembre de 2016",
              },
              approved: {
                position: "Sistema Integrado de Gestión",
                date: "14 de diciembre de 2016",
              },
            }),
          },
          children: await Promise.all(content),
        },
      ],
    });

    return doc;
  }
}
