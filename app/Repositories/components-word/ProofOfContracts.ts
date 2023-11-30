import { ComponentsWord } from "./ComponentsWord";
import { Document } from "docx";

export class ProofOfContracts {
    async generateReport(dataReport: any): Promise<any> {
        const componentsWord = new ComponentsWord();
        const {
            subTitle,
            generateParagraph,
            generateTablePerContract,
            getHeaderLogoOnly,
            getFooterLogoOnly,
            getComponentFirm,
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

        const contracts = dataReport.contracts.map((element: any) => {
            return {
                consecutive: 4,
                componentWordProp: generateTablePerContract.bind({ text: "" }),
                argumentsComponent: {
                    text: "",
                    nosContracto: element.numberContract,
                    objeto: element.objectContract,
                    obligacionesContractuales: element.contractualObligations,
                    valorContrato: element.contractValue,
                    fechaInicio: element.startDate,
                    fechaTerminacion: element.endDate,
                    lugarEjecucion: element.executionPlace,
                    cumplimiento: element.compliance,
                    sanciones: element.sanctions,
                },
                placeholders: [
                    {
                        key: "",
                        newText: "",
                    },
                ],
            };
        });

        const dataContentReport = [
            {
                consecutive: 1,
                componentWordProp: subTitle.bind({
                    text: "",
                    textOne: "",
                    textTwo: "",
                }),
                argumentsComponent: {
                    text: "LA SUBDIRECCIÓN ADMINISTRATIVA, FINANCIERA Y DE APOYO A LA GESTIÓN DE LA AGENCIA DE EDUCACIÓN POSTSECUNDARIA DE MEDELLÍN-SAPIENCIA",
                    bold: false,
                },
                placeholders: [
                    {
                        key: "",
                        newText: "",
                    },
                ],
            },
            {
                consecutive: 2,
                componentWordProp: subTitle.bind({ text: "" }),
                argumentsComponent: {
                    text: "HACE CONSTAR:",
                    bold: false,
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
                componentWordProp: generateParagraph.bind({ text: "", size: 20 }),
                argumentsComponent: {
                    text: "Que [nombre completo] con [tipo documento] [número documento] ha celebrado los siguientes contratos de prestación de servicios con LA AGENCIA DE EDUCACIÓN POSTSECUNDARIA DE MEDELLÍN – SAPIENCIA, entidad descentralizada en la modalidad de Unidad Administrativa Especial, del nivel territorial y del orden municipal, identificada con NIT 900.602.106-0: ",
                    size: 20,
                },
                placeholders: [
                    {
                        key: "[nombre completo]",
                        newText: dataReport.completeName,
                    },
                    {
                        key: "[tipo documento]",
                        newText: dataReport.typeDocument,
                    },
                    {
                        key: "[número documento]",
                        newText: dataReport.numberDocument,
                    },
                ],
            },
            ...contracts,
            {
                consecutive: 6,
                componentWordProp: generateParagraph.bind({ text: "", size: 20 }),
                argumentsComponent: {
                    text: "Esta constancia se expide a solicitud del interesado en Medellín, a los [letra del día actual] ([número del día actual]) días de [mes actual] de [año actual]",
                    size: 20,
                },
                placeholders: [
                    {
                        key: "[letra del día actual]",
                        newText: dataReport.letterActualDay,
                    },
                    {
                        key: "[número del día actual]",
                        newText: dataReport.numberActualDay,
                    },
                    {
                        key: "[mes actual]",
                        newText: dataReport.actualMonth,
                    },
                    {
                        key: "[año actual]",
                        newText: dataReport.actualYear,
                    },
                ],
            },
            {
                consecutive: 7,
                componentWordProp: getComponentFirm.bind({ text: "" }),
                argumentsComponent: {
                    text: "",
                    name: dataReport.universityProfessionalName,
                    size: 25,
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
                        default: await getHeaderLogoOnly({
                            logo: "logos_(sap-med).png",
                        })
                    },
                    footers: {
                        default: await getFooterLogoOnly({
                            logo: "pie-pagina_sapiencia.jpg",
                        })
                    },
                    children: await Promise.all(content)
                }
            ]
        })

        return doc;
    }


}
