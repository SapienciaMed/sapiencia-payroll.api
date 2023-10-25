import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateAndUpdateOtherIncomeValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    codTypeIncome: schema.number(),
    codEmployment: schema.number(),
    codPayroll: schema.number(),
    value: schema.number(),
    state: schema.string(),
  });

  public messages: CustomMessages = {};
}
