import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class GenerateReportValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    period: schema.string([rules.minLength(4), rules.maxLength(4)]),
    codEmployment: schema.string(),
    typeReport: schema.number(),
  });

  public messages: CustomMessages = {};
}
