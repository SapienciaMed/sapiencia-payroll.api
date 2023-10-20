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
  Route.get("/get-by-id/:id","TaxDeductibleController.getTaxDeductibleById");
}).prefix("/api/v1/tax-deductible").middleware('auth')


Route.group(() => {
  Route.get(
    "/generate-by-id/:id",
    "PayrollGenerateController.payrollGenerateById"
  );
}).prefix("/api/v1/payroll-generate");

Route.group(() => {
  Route.get("/typesContracts", "VinculationController.getTypesContracts");
  Route.get("/charges", "VinculationController.getCharges");
  Route.get(
    "/reasonsForWithdrawal",
    "VinculationController.getReasonsForWithdrawalList"
  );
  Route.get("/worker", "VinculationController.getActiveWorkers");
  Route.get(
    "/contractors",
    "VinculationController.getActivesContractorworkers"
  );
  Route.get("/:id", "VinculationController.getVinculationById");
  Route.get("/employment/:id", "VinculationController.getEmploymentById");
  Route.post(
    "/worker/get-by-filters/",
    "VinculationController.getWorkersByFilters"
  );
  Route.post("/get-paginated", "VinculationController.getVinculationsPaginate");
  Route.post("/", "VinculationController.createVinculation");
  Route.post(
    "/employment/get-paginated",
    "VinculationController.getEmploymentPaginate"
  );
  Route.post("/suspension", "VinculationController.createContractSuspension");
  Route.post(
    "/suspension/get-paginated",
    "VinculationController.getContractSuspensionPaginate"
  );
  Route.put("/", "VinculationController.updateVinculation");
  Route.put(
    "/employment/retirement",
    "VinculationController.retirementEmployment"
  );
})
  .prefix("/api/v1/vinculation")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "VacationsController.getVacations");
  Route.post("/create", "VacationsController.createVacationDays");
  Route.post("/workerVacation", "VacationsController.getVacationsByParams");
  Route.post("/get-paginated", "VacationsController.getVacationsPaginate");
  Route.put("/", "VacationsController.updateVacationPeriod");
})
  .prefix("/api/v1/vacations")
  .middleware("auth");

Route.group(() => {
  Route.get("/incapacity-types", "IncapacityController.getIncapacityTypes");
  Route.get("/get-by-id/:id", "IncapacityController.getIncapacityById");
  Route.post("/create", "IncapacityController.createIncapacity");
  Route.post("/get-paginated", "IncapacityController.getIncapacityPaginate");
  Route.put("/update", "IncapacityController.updateIncapacity");
})
  .prefix("/api/v1/incapacity")
  .middleware("auth");

Route.group(() => {
  Route.get("/types", "LicencesController.getLicenceTypes");
  Route.get("/:id", "LicencesController.getLicenseById");
  Route.post("/", "LicencesController.createLicence");
  Route.post("/get-paginated", "LicencesController.getLicencePaginate");
})
  .prefix("/api/v1/licence")
  .middleware("auth");

Route.group(() => {
  Route.get("/types", "FormPeriodsController.getFormTypes");
  Route.get("/available", "FormPeriodsController.getFormPeriod");
  Route.get("/last/:id", "FormPeriodsController.getLastPeriods");
  Route.get("/:id", "FormPeriodsController.getFormPeriodById");
  Route.post("/", "FormPeriodsController.createFormPeriod");
  Route.post("get-paginated", "FormPeriodsController.getFormPeriodPaginate");
  Route.put("/", "FormPeriodsController.updateFormPeriod");
})
  .prefix("/api/v1/payroll")
  .middleware("auth");

Route.group(() => {
  Route.get(
    "/type/:type",
    "ManualDeductionsController.getDeductionTypesByType"
  );
  Route.get("/:id", "ManualDeductionsController.getManualDeductionById");
  Route.post("/", "ManualDeductionsController.createDeduction");
  Route.post(
    "get-paginated",
    "ManualDeductionsController.getManualDeductionPaginate"
  );
  Route.put("/", "ManualDeductionsController.updateManualDeduction");
})
  .prefix("/api/v1/deduction")
  .middleware("auth");

Route.group(() => {
  Route.get("/:id", "SalaryIncrementsController.getSalaryIncrementById");
  Route.post("/", "SalaryIncrementsController.createSalaryIncrements");
  Route.post(
    "get-paginated",
    "SalaryIncrementsController.getSalaryHistoriesPaginate"
  );
  Route.put("/", "SalaryIncrementsController.updateSalaryIncrements");
})
  .prefix("/api/v1/salaryIncrease")
  .middleware("auth");
