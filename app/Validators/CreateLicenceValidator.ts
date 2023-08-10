import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateLicenceValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    codEmployment: schema.number(),
    idLicenceType: schema.number.optional(),
    dateStart: schema.date(),
    dateEnd: schema.date(),
    licenceState: schema.string.optional([rules.maxLength(20)]),
    observation: schema.string.optional([rules.maxLength(500)]),
  });

  public messages: CustomMessages = { err: "error" };
}
