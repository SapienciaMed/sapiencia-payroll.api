import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateLicenceValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    codEmployment: schema.number(),
    idLicenceType: schema.number.optional(),
    dateStart: schema.date({ format: "yyyy/MM/dd" }),
    dateEnd: schema.date({ format: "yyyy/MM/dd" }),
    resolutionNumber: schema.string([rules.maxLength(50)]),
    licenceState: schema.string.optional([rules.maxLength(20)]),
    observation: schema.string.optional([rules.maxLength(500)]),
  });

  public messages: CustomMessages = { err: "error" };
}
