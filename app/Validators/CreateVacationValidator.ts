import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateAndUpdateVacationValidator {
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
    vacationDay: schema.array().members(
      schema.object().members({
        id: schema.number.optional(),
        codVacation: schema.number(),
        dateFrom: schema.date(),
        dateUntil: schema.date.optional(),
        enjoyedDays: schema.number(),
        paid: schema.boolean(),
        codForm: schema.number.optional(),
        observation: schema.string.optional(),
        userModified: schema.string.optional(),
        dateModified: schema.date.optional(),
        userCreate: schema.string.optional(),
        dateCreate: schema.date.optional(),
      })
    ),
    periodId: schema.number(),
    enjoyedDays: schema.number(),
    avaibleDays: schema.number(),
    refundDays: schema.number(),
    formedDays: schema.number()
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
  public messages: CustomMessages = { err: "error" };
}
