import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class TaxDeductibleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    year: schema.number(),
    codEmployment: schema.number(),
    type: schema.string(),
    value: schema.number(),
    state: schema.string(),
  });

  public messages: CustomMessages = { err: "error" };
}
