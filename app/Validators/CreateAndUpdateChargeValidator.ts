import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateAndUpdateChargeValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    name: schema.string.optional(),
    codChargeType: schema.number(),
    observations: schema.string.optional([rules.maxLength(500)]),
    baseSalary: schema.number(),
    state: schema.boolean(),
  });
  public messages: CustomMessages = { err: "error" };
}