import { SwaggerConfig } from "@ioc:Adonis/Addons/Swagger";

export default {
  uiEnabled: true, //disable or enable swaggerUi route
  uiUrl: "docs", // url path to swaggerUI
  specEnabled: true, //disable or enable swagger.json route
  specUrl: "/swagger.json",

  middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

  options: {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Documentación API Autenticación",
        version: "1.0.0",
        description: "Catalago de servicios",
      },
      components: {
        securitySchemes: {
          apiAuth: {
            type: "http",
            description:
              "Login with email and password to get the authentication token",
            name: "Token based Based",
            in: "header",
            bearerFormat: "JWT",
            scheme: "bearer",
          },
        },
      },
    },

    apis: ["app/**/*.ts", "docs/swagger/**/*.yml", "start/routes.ts"],

    basePath: "/",
  },
  mode: process.env.NODE_ENV === "production" ? "PRODUCTION" : "RUNTIME",
  specFilePath: "docs/swagger.json",
} as SwaggerConfig;
