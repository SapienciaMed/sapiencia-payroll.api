import { schema, CustomMessages , rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";


export default class WorkerValidator {

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
     id : schema.number.optional(),
     codIncapacityType : schema.number(),
     codEmployee : schema.number(),
     dateInitial : schema.date(),
     dateFinish : schema.date(),
     comments : schema.string([rules.maxLength(100)]),
     isExtension : schema.boolean.optional(),
     userModified : schema.string.optional([rules.maxLength(15)]),
     userCreate : schema.string.optional([rules.maxLength(15)])
  })

  // public schema = schema.create({
  //   id: schema.number.optional(),
  //   codEmployment: schema.string(),
  //   period: schema.string(),
  //   dateFrom: schema.date(),
  //   dateUntil: schema.date(),
  //   periodFormer: schema.string(),
  //   enjoyed: schema.string(),
  //   available: schema.string(),
  //   days: schema.string(),
  //   periodClosed: schema.boolean(),
  // });

  public messages: CustomMessages = {"err":"error"};

}
