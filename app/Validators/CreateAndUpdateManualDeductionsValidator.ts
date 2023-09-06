import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateAndUpdateManualDeductionsValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    codEmployment: schema.number(),
    codDeductionType: schema.number.optional(),
    cyclic: schema.boolean(),
    numberInstallments: schema.number.optional(),
    applyExtraordinary: schema.boolean.optional(),
    value: schema.number(),
    porcentualValue: schema.boolean(),
    codFormsPeriod: schema.number.optional(),
    state: schema.string([rules.maxLength(20)]),
    observation: schema.string.optional([rules.maxLength(500)]),
  });

  public messages: CustomMessages = { err: "error" };
}
