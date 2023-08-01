/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", async () => {
  return "Api de servicios Transversales de SAPIENCIA";
});

Route.group(() => {
  Route.get("/typesContracts", "VinculationController.getTypesContracts");
  Route.get("/charges", "VinculationController.getCharges");
  Route.get("/worker", "VinculationController.getActiveWorkers");
  Route.get("/:id", "VinculationController.getVinculationById");
  Route.put("/", "VinculationController.updateVinculation");
  Route.post("/get-paginated", "VinculationController.getVinculationsPaginate");
  Route.post("/", "VinculationController.createVinculation");
  Route.post(
    "/employment/get-paginated",
    "VinculationController.getEmploymentPaginate"
  );
}).prefix("/api/v1/vinculation");

Route.group(() => {
  Route.post("/", "VacationsController.getVacations");
  Route.post("/create", "VacationsController.createVacationDays");
  Route.post("/update", "VacationsController.updateVacation");
  Route.post("/workerVacation", "VacationsController.getVacationsByParams");
  Route.post("/get-paginated", "VacationsController.getVacationsPaginate");
}).prefix("/api/v1/vacations");

Route.group(() => {
  Route.get("/incapacity-types", "IncapacityController.getIncapacityTypes");
  Route.post("/create", "IncapacityController.createIncapacity");
  Route.post("/get-paginated", "IncapacityController.getIncapacityPaginate");
}).prefix("/api/v1/incapacity");
