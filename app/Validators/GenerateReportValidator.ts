import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class GenerateReportValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    period: schema.number(),
    codEmployment: schema.number.optional(),
    typeReport: schema.number(),
  });

  public messages: CustomMessages = {};
}
