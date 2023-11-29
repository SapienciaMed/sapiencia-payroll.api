import { ComponentsWord } from "./ComponentsWord"
import { Document } from 'docx';

export class AdministrativeActReport {

    async generateReport(dataReport:any): Promise<any> {

        const componentsWord = new ComponentsWord();
        const { subTitle, generateParagraph, generateFooter, generateHeader, subTitleDoubleLine, generateParagraphWithInitialBold, generateDocumentTraceabilityAproved, generateSettlementOfSocialBenefits } = componentsWord

        const replacePlaceholders = (text: string, placeholders: any[]) => {
            let modifiedText = text;
            placeholders.forEach((placeholder) => {
                modifiedText = modifiedText.replace(placeholder.key, placeholder.newText);
            });
            return modifiedText;
        };


        const dataContentReport = [
            {
                consecutive: 1,
                componentWordProp: subTitleDoubleLine.bind({ text:'',textOne: '', textTwo:'' }),
                argumentsComponent: {
                    text:'[observación de liquidación]',
                    textOne: "",
                    textTwo: ""
                },
                placeholders: [
                    {
                        key: '[observación de liquidación]',
                        newText: dataReport.settlementObservation
                    }
                ]
            },
            {
                consecutive: 2,
                componentWordProp: generateParagraph.bind({ text: '', size: 20 }),
                argumentsComponent: {
                    text: dataReport.paragraphOne,
                    size: 20
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 3,
                componentWordProp: subTitle.bind({ text: '' }),
                argumentsComponent: {
                    text: "CONSIDERANDO QUE:",
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 4,
                componentWordProp: generateParagraph.bind({ text: '' }),
                argumentsComponent: {
                    text: dataReport.paragraphTwo,
                    size:20
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 5,
                componentWordProp: generateParagraph.bind({ text: '' }),
                argumentsComponent: {
                    text: "Mediante el Acuerdo 019 de noviembre de 2020, se modificó el Decreto con fuerza de Acuerdo 1364 de 2012, en cuanto a la denominación, objeto, funciones y otros aspectos de la Agencia de Educación Superior de Medellín - Sapiencia, por lo que, a partir del 18 de diciembre de 2020 (fecha de entrada en vigor del precitado acuerdo), la entidad pasó a denominarse Agencia de Educación Postsecundaria de Medellín - Sapiencia.",
                    size:20,
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 6,
                componentWordProp: generateParagraph.bind({ text: '' }),
                argumentsComponent: {
                    text: "[apelativo] [nombre completo], identificada con [nombre tipo documento] Nro. [no documento], estuvo vinculada a la Agencia de Educación Postsecundaria de Medellín – SAPIENCIA, del [fecha inicial del contrato] al [fecha final del contrato], se desempeñó en el cargo denominado [cargo] - [dependencia] para la Gestión de Educación Postsecundaria, [tipo de vinculación].",
                    size:20,
                },
                placeholders: [
                    {
                        key: '[apelativo]',
                        newText: dataReport.apelative
                    },
                    {
                        key: '[nombre completo]',
                        newText: dataReport.completeName
                    },
                    {
                        key: '[nombre tipo documento]',
                        newText: dataReport.typeDocument
                    },
                    {
                        key: '[no documento]',
                        newText: dataReport.numberDocument
                    },
                    {
                        key: '[fecha inicial del contrato]',
                        newText: dataReport.initialDateContract
                    },
                    {
                        key: '[fecha final del contrato]',
                        newText: dataReport.finalDateContract
                    },
                    {
                        key: '[cargo]',
                        newText: dataReport.chargeName
                    },
                    {
                        key: '[dependencia]',
                        newText: dataReport.dependenceName
                    },
                    {
                        key: '[tipo de vinculación]',
                        newText: dataReport.linkageType
                    }
                ]
            },
            {
                consecutive: 7,
                componentWordProp: generateParagraph.bind({ text: '' }),
                argumentsComponent: {
                    text: "A través de la [observación de liquidación], “por medio de la cual se acepta la renuncia a un servidor de la Agencia de Educación Postsecundaria de Medellín - SAPIENCIA”, se aceptó la renuncia presentada mediante oficio con radicado [observación de liquidación], por [servidor@] [nombre completo], identificado con [nombre tipo documento] número [número documento] al cargo de [tipo de vinculación], Nivel: [cargo], denominado: [Directivo] para [dependencia] Postsecundaria, Código 084, Grado 02.",
                    size:20,
                },
                placeholders: [
                    {
                        key: '[observación de liquidación]',
                        newText: dataReport.settlementObservation
                    },
                    {
                        key: '[radicado]',
                        newText: dataReport.filed
                    },
                    {
                        key: '[servidor@]',
                        newText: dataReport.server
                    },
                    {
                        key: '[nombre completo]',
                        newText: dataReport.completeName
                    },
                    {
                        key: '[nombre tipo documento]',
                        newText: dataReport.typeDocument
                    },
                    {
                        key: '[número documento]',
                        newText: dataReport.numberDocument
                    },
                    {
                        key: '[tipo de vinculación]',
                        newText: dataReport.linkageType
                    },
                    {
                        key: '[nivel]',
                        newText: dataReport.levelCharge
                    },
                    {
                        key: '[cargo]',
                        newText: dataReport.chargeName
                    },
                    {
                        key: '[dependencia]',
                        newText: dataReport.dependenceName
                    }
                ]
            },
            {
                consecutive: 8,
                componentWordProp: generateParagraph.bind({ text: '' }),
                argumentsComponent: {
                    text: "[apelativo] [nombre completo], identificado con [tipo documento] Nro. [numero documento], tiene derecho al pago de las siguientes prestaciones sociales de acuerdo con lo estipulado en los Decretos No. 3135 de 1968 reglamentado por el Decreto 1848 de 1969, Decreto 1042, Decreto No. 1045 de 1978 y el Decreto 404 del 2006: vacaciones, prima de vacaciones y bonificación especial de recreación proporcional.",
                    size:20,
                },
                placeholders: [
                    {
                        key: '[apelativo]',
                        newText: dataReport.apelative
                    },
                    {
                        key: '[nombre completo]',
                        newText: dataReport.completeName
                    },
                    {
                        key: '[tipo documento]',
                        newText: dataReport.typeDocument
                    },
                    {
                        key: '[numero documento]',
                        newText: dataReport.numberDocument
                    }
                ]
            },
            {
                consecutive: 9,
                componentWordProp: generateParagraph.bind({ text: '' }),
                argumentsComponent: {
                    text: "El Decreto 1048 de 1978 en su artículo 8 establece 'De las vacaciones, los empleados públicos y trabajadores oficiales tienen derecho a quince (15) días hábiles de vacaciones por cada año de servicios...', en su artículo 17 establece 'De los factores salariales para la liquidación de vacaciones y prima de vacaciones...'. Que, el literal b) del artículo 20 del Decreto 1045 de 1978, establece que las vacaciones podrán ser compensadas en dinero cuando el empleado público quede retirado definitivamente del servicio sin haber disfrutado de las vacaciones causadas hasta entonces.",
                    size:20,
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 10,
                componentWordProp: generateParagraphWithInitialBold.bind({ text: '' }),
                argumentsComponent: {
                    text: "",
                    textOne:'Prima de Navidad:',
                    textTwo:'Artículo 32 del Decreto 1045 de 1978: “Cuando el empleado o trabajador oficial no hubiere servido durante todo el año civil, tendrá derecho a la mencionada prima de navidad, en proporción al tiempo laborado, se liquidará y pagará con base en el último salario devengado, o en el último promedio mensual, si fuere variable”.',
                    size:20,
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 11,
                componentWordProp: generateParagraphWithInitialBold.bind({ text: '' }),
                argumentsComponent: {
                    text: "",
                    textOne:'Prima de servicios:',
                    textTwo:'Artículo 60 del decreto 1042 de 1978. Pago Proporcional de la prima de servicio, “Cuando el funcionario no haya trabajado el año completo en la misma entidad tendrá derecho al pago proporcional de la prima, por cada mes completo de labor y siempre que hubiere servido en el organismo por lo menos un semestre”.',
                    size:20,
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 12,
                componentWordProp: generateParagraph.bind({ text: '' }),
                argumentsComponent: {
                    text: "La Subdirección Administrativa, Financiera y de Apoyo a la Gestión certifica la existencia de disponibilidad presupuestal en el rubro para la apropiación correspondiente.",
                    size:20,
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 13,
                componentWordProp: generateParagraph.bind({ text: '' }),
                argumentsComponent: {
                    text: "En mérito de lo expuesto",
                    size:20,
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 14,
                componentWordProp: subTitle.bind({ text: '' }),
                argumentsComponent: {
                    text: "RESUELVE",
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 15,
                componentWordProp: generateParagraphWithInitialBold.bind({ text: '' }),
                argumentsComponent: {
                    text: "Reconocer a [apelativo] [nombre completo], identificada con [tipo documento] Nro. [numero documento], por concepto de prestaciones sociales definitivas la suma de [valor total en letras a pagar] ([valor total en número a pagar]) correspondientes al cargo de [tipo de vinculación], Nivel: [cargo], denominado: [cargo] - [dependencia] para la Gestión de Educación Postsecundaria, Código 084, Grado 02",
                    textOne:'ARTÍCULO PRIMERO:',
                    textTwo:'',
                    size:20,
                },
                placeholders: [
                    {
                        key: '[apelativo]',
                        newText: dataReport.apelative
                    },
                    {
                        key: '[nombre completo]',
                        newText: dataReport.completeName
                    },
                    {
                        key: '[tipo documento]',
                        newText: dataReport.typeDocument
                    },
                    {
                        key: '[numero documento]',
                        newText: dataReport.numberDocument
                    },
                    {
                        key: '[valor total en letras a pagar]',
                        newText: dataReport.totalValueInLettersPayable
                    },
                    {
                        key: '[valor total en número a pagar]',
                        newText: dataReport.totalValueInNumberToPay
                    },
                    {
                        key: '[tipo de vinculación]',
                        newText: dataReport.linkageType
                    },
                    {
                        key: '[nivel]',
                        newText: dataReport.levelCharge
                    },
                    {
                        key: '[cargo]',
                        newText: dataReport.chargeName
                    },
                    {
                        key: '[dependencia]',
                        newText: dataReport.dependenceName
                    }
                ]
            },
            {
                consecutive: 16,
                componentWordProp:  generateSettlementOfSocialBenefits.bind({ text: '' }),
                argumentsComponent: {
                    text:'',
                    fechaResolucion:dataReport.dateResolution,
                    valorTotalResolucion:dataReport.valueTotalResolution,
                    nombre: dataReport.completeName,
                    noDocumento:dataReport.numberDocument,
                    fechaIngreso: dataReport.initialDateContract,
                    fechaRetiro: dataReport.finalDateContract,
                    diasCesantias: dataReport.daysCesantias,
                    diasInteresesCesantias: dataReport.daysInterestSeverancePay,
                    diasPrimaNavidad: dataReport.premiumChristmasDays,
                    diasVacionesYPrimaVacaciones: dataReport.vacationDaysAndVacationBonus,
                    diasBonificacionServicios: dataReport.daysBonusServices,
                    diasPrimaServicio: dataReport.daysPremiumService,
                    cesantias: dataReport.cesantias,
                    interesesCesantias: dataReport.interestCesantias,
                    vacaciones: dataReport.vacations,
                    bonificacionRecreacion:dataReport.recreationBonus,
                    primaNavidad:dataReport.vacations,
                    bonificacionServicios: dataReport.serviceBonus,
                    primaServicios:dataReport.premiunService,
                    salarios: dataReport.salary,
                    aportesSeguridadSocial: dataReport.socialSecurityContributions,
                    aportesAFC:dataReport.contributionsAFC,
                    retencionFuenteRenta: dataReport.retentionSourceIncome,
                    totalPagarPrestacionesSociales: dataReport.totalPagarPrestacionesSociales,
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 17,
                componentWordProp: generateParagraphWithInitialBold.bind({ text: '' }),
                argumentsComponent: {
                    text: "",
                    textOne:'ARTÍCULO SEGUNDO:',
                    textTwo:'Esta liquidación puede estar sujeta a retención en la fuente la cual se aplica al momento de efectuarse el pago.',
                    size:20
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 18,
                componentWordProp: generateParagraphWithInitialBold.bind({ text: '' }),
                argumentsComponent: {
                    text: "",
                    textOne:'ARTÍCULO TERCERO:',
                    textTwo:'Contra la presente resolución procede el recurso de Reposición dentro de los diez (10) días hábiles siguientes a la fecha de su notificación.',
                    size:20
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 19,
                componentWordProp: subTitle.bind({ text: '' }),
                argumentsComponent: {
                    text: "NOTÍFIQUESE Y CÚMPLASE"
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 20,
                componentWordProp: subTitleDoubleLine.bind({ text:'',textOne: '', textTwo:'' }),
                argumentsComponent: {
                    text:'',
                    textOne: dataReport.nameFirmDocument,
                    textTwo: "Director General ",
                    boldTwo: false
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 21,
                componentWordProp: generateDocumentTraceabilityAproved.bind({ text: '' }),
                argumentsComponent: {
                    text:'',
                    nameTH:'Nombre 1',
                    nameContador:'Nombre 2',
                    nameAdministrativa:'Nombre 3',
                    nameJuridica:'Nombre 4',
                    nameFinanciera:'Nombre 5',
                    nameJefeJuridica:'Nombre 6',
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
        ]

        const content = dataContentReport.map(async (item: any) => {
            const { componentWordProp, argumentsComponent, placeholders } = item
            // Realiza la sustitución de placeholders en el texto
            const modifiedText = replacePlaceholders(argumentsComponent.text, placeholders);
            // Ajusta dinámicamente los argumentos utilizando argumentsComponent
            const modifiedComponentWord = await componentWordProp({ ...argumentsComponent, text: modifiedText });
            return await modifiedComponentWord;
        });

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    headers: {
                        default: await generateHeader({
                            title: "ACTO ADMINISTRATIVO",
                            typeDocument: 'FORMATO',
                            code: 'F-AP-GJ-011',
                            version: '2',
                            logo: 'logoSapiencia.png'
                        })
                    },
                    footers: {
                        default: await generateFooter({
                            elaborated: { position: 'Profesional de Apoyo Jurídico', date: '12 de diciembre de 2016' },
                            revised: { position: 'Jefe Oficina Jurídica', date: '12 de diciembre de 2016' },
                            approved: { position: 'Sistema Integrado de Gestión', date: '14 de diciembre de 2016' },
                        })
                    },
                    children: await Promise.all(content)
                }
            ]
        })

        return doc;
    }



}