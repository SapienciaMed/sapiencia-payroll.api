import { ComponentsWord } from "./ComponentsWord"
import { Document, Packer, Header, Paragraph, TextRun, WidthType, PageNumber, ImageRun, AlignmentType, BorderStyle, VerticalAlign, HorizontalPositionAlign, Table, TableRow, TableCell } from 'docx';


export class ProofOfContracts {

    async generateReport(): Promise<any> {

        const componentsWord = new ComponentsWord();
        const { subTitle, generateParagraph, generateFooter, generateHeader, subTitleDoubleLine, generateParagraphWithInitialBold, generateDocumentTraceabilityAproved, generateSettlementOfSocialBenefits, generateTablePerContract } = componentsWord

        const replacePlaceholders = (text: string, placeholders: any[]) => {
            let modifiedText = text;
            placeholders.forEach((placeholder) => {
                modifiedText = modifiedText.replace(placeholder.key, placeholder.newText);
            });
            return modifiedText;
        };


        const contracts = [
            {
            consecutive: 4,
            componentWordProp: generateTablePerContract.bind({ text: '' }),
            argumentsComponent: {
                text: "",
                noContracto:'379-2023',
                objeto:"Prestación de servicios para apoyar la gestión financiera del área contable de la Agencia de Educación Postsecundaria de Medellín – SAPIENCIA",
                obligacionesContractuales:[
                    {text: "Elaborar de manera oportuna las cuentas de cobro requeridas por las diferentes áreas de la Agencia para el reintegro de recursos y rendimientos financieros de los diferentes convenios suscritos por la Agencia. "},
                    {text: "Radicar y hacer seguimiento a los oficios, cartas, cuentas de cobro y demás documentos generados desde el proceso de contabilidad en lo referente a generación de cuentas de cobro. "},
                    {text: "Radicar y hacer seguimiento a los oficios, cartas, cuentas de cobro y demás documentos generados desde el proceso de contabilidad en lo referente a generación de cuentas de cobro. "},
                ],
                valorContrato:'23.333.535',
                fechaInicio:'Junio 05 de 2023',
                fechaTerminacion:'Junio 05 de 2023',
                lugarEjecucion:'Medellín',
                cumplimiento:'En ejecución',
                sanciones:'N/A',
            },
            placeholders: [
                {
                    key: '',
                    newText: ''
                }
            ]
        },
        {
            consecutive: 1,
            componentWordProp: subTitle.bind({ text: '' }),
            argumentsComponent: {
                text: '',
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
            componentWordProp: generateTablePerContract.bind({ text: '' }),
            argumentsComponent: {
                text: "",
                noContracto:'379-2023',
                objeto:"Prestación de servicios para apoyar la gestión financiera del área contable de la Agencia de Educación Postsecundaria de Medellín – SAPIENCIA",
                obligacionesContractuales:[
                    {text: "Elaborar de manera oportuna las cuentas de cobro requeridas por las diferentes áreas de la Agencia para el reintegro de recursos y rendimientos financieros de los diferentes convenios suscritos por la Agencia. "},
                    {text: "Radicar y hacer seguimiento a los oficios, cartas, cuentas de cobro y demás documentos generados desde el proceso de contabilidad en lo referente a generación de cuentas de cobro. "},
                    {text: "Radicar y hacer seguimiento a los oficios, cartas, cuentas de cobro y demás documentos generados desde el proceso de contabilidad en lo referente a generación de cuentas de cobro. "},
                ],
                valorContrato:'23.333.535',
                fechaInicio:'Junio 05 de 2023',
                fechaTerminacion:'Junio 05 de 2023',
                lugarEjecucion:'Medellín',
                cumplimiento:'En ejecución',
                sanciones:'N/A',
            },
            placeholders: [
                {
                    key: '',
                    newText: ''
                }
            ]
        }
    ]

        const dataContentReport = [
            {
                consecutive: 1,
                componentWordProp: subTitle.bind({ text: '', textOne: '', textTwo: '' }),
                argumentsComponent: {
                    text: 'LA SUBDIRECCIÓN ADMINISTRATIVA, FINANCIERA Y DE APOYO A LA GESTIÓN DE LA AGENCIA DE EDUCACIÓN POSTSECUNDARIA DE MEDELLÍN-SAPIENCIA',
                    bold: false
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
                componentWordProp: subTitle.bind({ text: ''}),
                argumentsComponent: {
                    text: 'HACE CONSTAR:',
                    bold: false
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
                componentWordProp: generateParagraph.bind({ text: '', size: 20 }),
                argumentsComponent: {
                    text: "Que [nombre completo] con [tipo documento] [número documento] ha celebrado los siguientes contratos de prestación de servicios con LA AGENCIA DE EDUCACIÓN POSTSECUNDARIA DE MEDELLÍN – SAPIENCIA, entidad descentralizada en la modalidad de Unidad Administrativa Especial, del nivel territorial y del orden municipal, identificada con NIT 900.602.106-0: ",
                    size: 20
                },
                placeholders: [
                    {
                        key: '[nombre completo]',
                        newText: 'Luis Daniel Garces'
                    },
                    {
                        key: '[tipo documento]',
                        newText: 'C.C.'
                    },
                    {
                        key: '[número documento]',
                        newText: '71.215.127'
                    }
                ]
            },
            ...contracts,
            {
                consecutive: 6,
                componentWordProp: generateParagraph.bind({ text: '', size: 20 }),
                argumentsComponent: {
                    text: "Esta constancia se expide a solicitud del interesado en Medellín, a los [letra del día actual] ([número del día actual]) días de [mes actual] de [año actual]",
                    size: 20
                },
                placeholders: [
                    {
                        key: '[letra del día actual]',
                        newText: 'seis'
                    },
                    {
                        key: '[número del día actual]',
                        newText: '06'
                    },
                    {
                        key: '[mes actual]',
                        newText: 'Junio'
                    },
                    {
                        key: '[año actual]',
                        newText: '2023'
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

