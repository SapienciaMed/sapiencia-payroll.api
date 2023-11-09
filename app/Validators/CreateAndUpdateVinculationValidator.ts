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
      id: schema.number.optional(),
      typeDocument: schema.string([rules.maxLength(4)]),
      numberDocument: schema.string([rules.maxLength(15)]),
      firstName: schema.string([rules.maxLength(50)]),
      secondName: schema.string.optional([rules.maxLength(50)]),
      surname: schema.string([rules.maxLength(50)]),
      secondSurname: schema.string.optional([rules.maxLength(50)]),
      birthDate: schema.date({ format: "yyyy/mm/dd" }),
      gender: schema.string([rules.maxLength(10)]),
      bloodType: schema.string([rules.maxLength(10)]),
      nationality: schema.string([rules.maxLength(10)]),
      email: schema.string.optional([rules.email(), rules.maxLength(50)]),
      contactNumber: schema.string([rules.maxLength(10)]),
      department: schema.string([rules.maxLength(10)]),
      municipality: schema.string([rules.maxLength(10)]),
      neighborhood: schema.string([rules.maxLength(100)]),
      address: schema.string([rules.maxLength(100)]),
      housingType: schema.string.optional([rules.maxLength(10)]),
      socioEconomic: schema.string.optional([rules.maxLength(2)]),
      fiscalIdentification: schema.string.optional([rules.maxLength(20)]),
      eps: schema.string.optional([rules.maxLength(10)]),
      severanceFund: schema.string.optional([rules.maxLength(10)]),
      fundPension: schema.string.optional([rules.maxLength(10)]),
      arl: schema.string.optional([rules.maxLength(10)]),
      riskLevel: schema.string.optional([rules.maxLength(10)]),
      bank: schema.string.optional([rules.maxLength(50)]),
      accountBankType: schema.string.optional([rules.maxLength(20)]),
      accountBankNumber: schema.string.optional([rules.maxLength(15)]),
      userModified: schema.string.optional([rules.maxLength(15)]),
      userCreate: schema.string.optional([rules.maxLength(15)]),
    }),
    relatives: schema.array().members(
      schema.object().members({
        id: schema.number.optional(),
        name: schema.string([rules.maxLength(150)]),
        relationship: schema.string([rules.maxLength(10)]),
        gender: schema.string.optional([rules.maxLength(10)]),
        birthDate: schema.date.optional({ format: "yyyy/mm/dd" }),
        dependent: schema.boolean(),
      })
    ),
    employment: schema.object().members({
      id: schema.number.optional(),
      codDependence: schema.number(),
      idCharge: schema.number(),
      contractNumber: schema.string([rules.maxLength(10)]),
      idTypeContract: schema.number(),
      startDate: schema.date({ format: "yyyy/mm/dd" }),
      endDate: schema.date.optional({ format: "yyyy/mm/dd" }),
      specificObligations: schema.string.optional(),
      contractualObject: schema.string.optional([rules.maxLength(500)]),
      institutionalMail: schema.string([rules.maxLength(50), rules.email()]),
      state: schema.string([rules.maxLength(10)]),
      idReasonRetirement: schema.number.optional(),
      retirementDate: schema.date.optional({ format: "yyyy/mm/dd" }),
      settlementPaid: schema.boolean.optional(),
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
