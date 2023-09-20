import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateAndUpdateFormPeriodValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    idFormType: schema.number(),
    state: schema.string([rules.maxLength(10)]),
    dateStart: schema.date({ format: "yyyy/MM/dd" }),
    dateEnd: schema.date({ format: "yyyy/MM/dd" }),
    paidDate: schema.date({ format: "yyyy/MM/dd" }),
    month: schema.number(),
    year: schema.number(),
    observation: schema.string.optional([rules.maxLength(500)]),
  });

  public messages: CustomMessages = { err: "error" };
}
