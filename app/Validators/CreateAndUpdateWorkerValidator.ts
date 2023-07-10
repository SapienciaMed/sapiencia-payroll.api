import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateAndUpdateWorkerValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    worker: schema.object().members({
      typeDocument: schema.string([rules.maxLength(4)]),
      numberDocument: schema.string([rules.maxLength(15)]),
      firstName: schema.string([rules.maxLength(50)]),
      secondName: schema.string.optional([rules.maxLength(50)]),
      surName: schema.string([rules.maxLength(50)]),
      secondSurname: schema.string.optional([rules.maxLength(50)]),
      gender: schema.string([rules.maxLength(10)]),
      bloodType: schema.string([rules.maxLength(10)]),
      birthDate: schema.date(),
      nationality: schema.string([rules.maxLength(10)]),
      email: schema.string.optional([rules.email(), rules.maxLength(50)]),
      contactNumber: schema.string([rules.maxLength(10)]),
      department: schema.string([rules.maxLength(10)]),
      municipality: schema.string([rules.maxLength(10)]),
      neighborhood: schema.string([rules.maxLength(100)]),
      address: schema.string([rules.maxLength(100)]),
      socioEconomic: schema.string.optional([rules.maxLength(2)]),
      eps: schema.string.optional([rules.maxLength(10)]),
      severanceFund: schema.string.optional([rules.maxLength(10)]),
      riskLevel: schema.string.optional([rules.maxLength(10)]),
      housingType: schema.string.optional([rules.maxLength(10)]),
      fundPension: schema.string.optional([rules.maxLength(10)]),
      userModified: schema.string.optional([rules.maxLength(15)]),
      userCreate: schema.string.optional([rules.maxLength(15)]),
    }),
    relatives: schema.array().members(
      schema.object().members({
        name: schema.string([rules.maxLength(150)]),
        relationship: schema.string([rules.maxLength(10)]),
        gender: schema.string([rules.maxLength(10)]),
        birthDate: schema.date(),
      })
    ),
    employment: schema.object().members({
      idCharge: schema.number(),
      contractNumber: schema.string([rules.maxLength(10)]),
      idTypeContract: schema.number(),
      startDate: schema.date(),
      endDate: schema.date.optional(),
      institutionalMail: schema.string([rules.maxLength(50), rules.email()]),
      state: schema.string([rules.maxLength(10)]),
      idReasonRetirement: schema.number.optional(),
      userModified: schema.string.optional([rules.maxLength(10)]),
      userCreate: schema.string.optional([rules.maxLength(15)]),
    }),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {};
}
