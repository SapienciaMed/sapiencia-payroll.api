import jwt from "jsonwebtoken";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";


export interface IDecodedToken {
  id: number;
}

export default class Auth {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    try {
      const { authorization: bearerToken } = request.headers();

      if (!bearerToken) {
        return response.forbidden(
          new ApiResponse(null, EResponseCodes.FAIL, "No existe el token")
        );
      }

      const accessToken = bearerToken.split(" ")[1];

      const { id } = jwt.verify(
        accessToken,
        Env.get("APP_KEY")
      ) as IDecodedToken;

      request["idUser"] = id;

      await next();
    } catch (error) {
      return response.forbidden(
        new ApiResponse(null, EResponseCodes.FAIL, String(error))
      );
    }
  }
}

