import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateSalaryIncrementValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    codCharge: schema.number(),
    effectiveDate: schema.date(),
    numberActApproval: schema.string([rules.maxLength(100)]),
    porcentualIncrement: schema.boolean(),
    incrementValue: schema.number(),
    previousSalary: schema.number(),
    newSalary: schema.number(),
    observation:schema.string([rules.maxLength(500)]),
    userModified: schema.string.optional([rules.maxLength(15)]),
    userCreate: schema.string.optional([rules.maxLength(15)]),
  });

  public messages: CustomMessages = { err: "error" };
}
