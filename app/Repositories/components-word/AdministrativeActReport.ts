import { ComponentsWord } from "./ComponentsWord"
import { Document, Packer, Header, Paragraph, TextRun, WidthType, PageNumber, ImageRun, AlignmentType, BorderStyle, VerticalAlign, HorizontalPositionAlign, Table, TableRow, TableCell } from 'docx';

export class AdministrativeActReport {

    async generateReport(): Promise<any> {


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
                    text:'',
                    textOne: "Resolución N. XXX",
                    textTwo: "(XXX de junio de 2023)"
                },
                placeholders: [
                    {
                        key: '',
                        newText: ''
                    }
                ]
            },
            {
                consecutive: 2,
                componentWordProp: generateParagraph.bind({ text: '', size: 20 }),
                argumentsComponent: {
                    text: "El Director General de la Agencia de Educación Postsecundaria de Medellín - Sapiencia, en uso de sus facultades legales y estatutarias contenidas en el Decreto con fuerza de Acuerdo 1364 de 2012, modificado por el Decreto con fuerza de Acuerdo 883 de 2015, el Acuerdo Municipal 019 de 2020 y las señaladas en el Estatuto General de la entidad contenido en el Acuerdo Directivo 003 de 2013, el Acuerdo Directivo 014 de 2015, modificados por el Acuerdo Directivo 29 de 2021 – Por el cual se expide el Estatuto General de la Agencia de Educación Postsecundaria de Medellín – Sapiencia, y",
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
                    text: "La Agencia de Educación Postsecundaria de Medellín – SAPIENCIA, es una unidad administrativa especial, del orden municipal, con personería jurídica, adscrita, según el Acuerdo 01 de 2016 al despacho del Alcalde, creada por Decreto con facultades especiales No. 1364 de 2012, modificado por el Decreto 883 de 2015 y su administración corresponde al Director General, quien será el representante legal.",
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
                    text: "La [apelativo] [nombre completo], identificada con [nombre tipo documento] Nro. [no documento], estuvo vinculada a la Agencia de Educación Postsecundaria de Medellín – SAPIENCIA, del [fecha inicial del contrato] al [fecha final del contrato], se desempeñó en el cargo denominado [cargo] - [dependencia] para la Gestión de Educación Postsecundaria, [tipo de vinculación].",
                    size:20,
                },
                placeholders: [
                    {
                        key: '[apelativo]',
                        newText: 'Señora'
                    },
                    {
                        key: '[nombre completo]',
                        newText: 'Luna Lorena'
                    },
                    {
                        key: '[nombre tipo documento]',
                        newText: 'cedula de ciudadanía'
                    },
                    {
                        key: '[no documento]',
                        newText: '39.211.104'
                    },
                    {
                        key: '[fecha inicial del contrato]',
                        newText: '31 de enero de 2023'
                    },
                    {
                        key: '[fecha final del contrato]',
                        newText: '05 de junio de 2023'
                    },
                    {
                        key: '[cargo]',
                        newText: 'Subdirector'
                    },
                    {
                        key: '[dependencia]',
                        newText: 'Subdirector'
                    },
                    {
                        key: '[tipo de vinculación]',
                        newText: 'Código 084, Grado 2, cargo de libre nombramiento y remoción de la Entidad'
                    }
                ]
            },
            {
                consecutive: 7,
                componentWordProp: generateParagraph.bind({ text: '' }),
                argumentsComponent: {
                    text: "A través de la [observación de liquidación], “por medio de la cual se acepta la renuncia a un servidor de la Agencia de Educación Postsecundaria de Medellín - SAPIENCIA”, se aceptó la renuncia presentada mediante oficio con radicado [radicado], por la [servidor@] [nombre completo], identificado con [nombre tipo documento] número [número documento] al cargo de [tipo de vinculación], Nivel: [cargo], denominado: [Directivo] para [dependencia] Postsecundaria, Código 084, Grado 02.",
                    size:20,
                },
                placeholders: [
                    {
                        key: '[observación de liquidación]',
                        newText: 'Resolución Nro. 1946 de junio 05 de 2023'
                    },
                    {
                        key: '[radicado]',
                        newText: 'Nro. I I202301000162 del 05 de junio de 2023'
                    },
                    {
                        key: '[servidor@]',
                        newText: 'servidora'
                    },
                    {
                        key: '[nombre completo]',
                        newText: 'ALINA MARCELA RESTREPO RODRÍGUEZ'
                    },
                    {
                        key: '[nombre tipo documento]',
                        newText: 'cédula de ciudadanía'
                    },
                    {
                        key: '[número documento]',
                        newText: '39.211.104'
                    },
                    {
                        key: '[tipo de vinculación]',
                        newText: 'libre nombramiento y remoción'
                    },
                    {
                        key: '[nivel]',
                        newText: 'Directivo'
                    },
                    {
                        key: '[cargo]',
                        newText: 'Subdirector'
                    },
                    {
                        key: '[dependencia]',
                        newText: 'la Gestión de Educación'
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
                        newText: 'La señora'
                    },
                    {
                        key: '[nombre completo]',
                        newText: 'ALINA MARCELA RESTREPO RODRÍGUEZ'
                    },
                    {
                        key: '[tipo documento]',
                        newText: 'cedula de ciudadanía'
                    },
                    {
                        key: '[numero documento]',
                        newText: '39.211.104'
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
                    text: "",
                    textOne:'ARTÍCULO PRIMERO:',
                    textTwo:'Reconocer a [apelativo] [nombre completo], identificada con [tipo documento] Nro. [numero documento], por concepto de prestaciones sociales definitivas la suma de [valor total en letras a pagar] ([valor total en número a pagar]) correspondientes al cargo de [tipo de vinculación], Nivel: [nivel], denominado: [cargo] - [dependencia] para la Gestión de Educación Postsecundaria, Código 084, Grado 02',
                    size:20,
                },
                placeholders: [
                    {
                        key: '[apelativo]',
                        newText: 'la señora'
                    },
                    {
                        key: '[nombre completo]',
                        newText: 'ALINA MARCELA RESTREPO RODRÍGUEZ'
                    },
                    {
                        key: '[tipo documento]',
                        newText: 'cedula de ciudadanía'
                    },
                    {
                        key: '[numero documento]',
                        newText: '39.211.104'
                    },
                    {
                        key: '[valor total en letras a pagar]',
                        newText: 'VEINTIDOS MILLONES DOSCIENTOS OCHENTA Y NUEVE MIL SETECIENTOS CINCO PESOS M.L'
                    },
                    {
                        key: '[valor total en número a pagar]',
                        newText: '$22.289.705'
                    },
                    {
                        key: '[tipo de vinculación]',
                        newText: 'libre nombramiento y remoción'
                    },
                    {
                        key: '[nivel]',
                        newText: 'Directivo'
                    },
                    {
                        key: '[cargo]',
                        newText: 'Subdirector'
                    },
                    {
                        key: '[dependencia]',
                        newText: 'Directivo'
                    }
                ]
            },
            {
                consecutive: 16,
                componentWordProp:  generateSettlementOfSocialBenefits.bind({ text: '' }),
                argumentsComponent: {
                    text:'',
                    fechaResolucion:'25 Noviembre 2023',
                    valorTotalResolucion:'22.334.343',
                    nombre:'Alina Marcela Restrepo Rodriguez',
                    noDocumento:'87.456.454',
                    fechaIngreso:'Enero 31 de 2023',
                    fechaRetiro:'Junio 05 de 2023',
                    diasCesantias:'126',
                    diasInteresesCesantias:'126',
                    diasPrimaNavidad:'126',
                    diasVacionesYPrimaVacaciones:'126',
                    diasBonificacionServicios:'126',
                    diasPrimaServicio:'126',
                    cesantias:'5.823.345',
                    interesesCesantias:'234.456',
                    vacaciones:'2.434.456',
                    bonificacionRecreacion:'30',
                    primaNavidad:'5.204.643',
                    bonificacionServicios:'1.604.643',
                    primaServicios:'2.804.643',
                    salarios:'2.219.643',
                    aportesSeguridadSocial:'346.643',
                    aportesAFC:'3643',
                    retencionFuenteRenta:'53645',
                    totalPagarPrestacionesSociales:'30.099.100',
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
                    textOne: "CARLOS ALBERTO CHAPARRO SANCHEZ",
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