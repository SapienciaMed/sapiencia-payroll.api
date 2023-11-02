import jwt from "jsonwebtoken";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import Encryption from "@ioc:Adonis/Core/Encryption";

export default class Auth {
  public async handle(
    ctx: HttpContextContract,
    next: () => Promise<void>,
    guards: string[]
  ) {
    const { authorization, permissions } = ctx.request.headers();
    const key = Env.get("APP_KEY");

    try {
      if (!authorization) {
        return ctx.response
          .status(401)
          .send(
            new ApiResponse(
              null,
              EResponseCodes.FAIL,
              "El token no ha sido proporcionado!."
            )
          );
      }

      const { id, document } = jwt.verify(
        authorization.replace("Bearer ", ""),
        key
      ) as { id: number; document: string };

      if (!id) {
        return ctx.response
          .status(401)
          .send(new ApiResponse(null, EResponseCodes.FAIL, "Token no valido"));
      }
      Env.set("CURRENT_AUTHORIZATION", authorization || "none");
      Env.set("CURRENT_PERMISSIONS", permissions || "none");
      Env.set("CURRENT_USER_DOCUMENT", document || "none");

      if (guards?.length > 0) {
        const subkey = authorization.split(".")[2];
        const accessEncryptor = Encryption.child({
          secret: subkey + Env.get("APP_KEY"),
        });

        const access: Array<string> | null = JSON.parse(
          accessEncryptor.decrypt(String(permissions)) || ""
        );

        if (!access?.find((i) => i === guards.find((g) => g === i))) {
          return ctx.response
            .status(403)
            .send(
              new ApiResponse(null, EResponseCodes.FAIL, "Acceso no autorizado")
            );
        }
      }
    } catch (error) {
      return ctx.response
        .status(401)
        .send(new ApiResponse(null, EResponseCodes.FAIL, "Token no valido!"));
    }

    await next();
  }
}
