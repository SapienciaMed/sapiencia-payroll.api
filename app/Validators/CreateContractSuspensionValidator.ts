import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateContractSuspensionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    codEmployment: schema.number(),
    dateStart: schema.date(),
    dateEnd: schema.date(),
    adjustEndDate: schema.boolean(),
    newDateEnd: schema.date(),
    observation: schema.string([rules.maxLength(500)]),
  });

  public messages: CustomMessages = { err: "error" };
}
