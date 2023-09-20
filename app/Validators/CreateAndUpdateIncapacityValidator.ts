import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class IncapacityValidator {
  /**
   *
   *
   * id
     codIncapacityType
     codEmployee
     dateInitial
     dateFinish
     comments
     isExtension
     userModified
     dateModified
     userCreate
     dateCreate
   *
   *
   */

  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    codIncapacityType: schema.number(),
    codEmployment: schema.number(),
    dateInitial: schema.date({ format: "yyyy/MM/dd" }),
    dateFinish: schema.date({ format: "yyyy/MM/dd" }),
    comments: schema.string.optional([rules.maxLength(100)]),
    isExtension: schema.boolean.optional(),
    userModified: schema.string.optional([rules.maxLength(15)]),
    userCreate: schema.string.optional([rules.maxLength(15)]),
  });

  public messages: CustomMessages = { err: "error" };
}
