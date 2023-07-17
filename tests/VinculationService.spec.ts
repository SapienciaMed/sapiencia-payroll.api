// import test from "japa";
// import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
// import { WorkerRepositoryFake } from "./FakeClass/WorkerRepositoryFake";
// import { ApiResponse } from "App/Utils/ApiResponses";
// import VinculationService from "App/Services/VinculationService";

// const service = new VinculationService(new WorkerRepositoryFake());

// test.group("RolService TEST for getWorkerById", () => {
//   test("class service must have a method getWorkerById with a return", async (assert) => {
//     const result = service.getWorkerById(1);
//     assert.isNotNull(result);
//   });

//   test("the method getWorkerById must be a promise", async (assert) => {
//     const result = service.getWorkerById(1);
//     assert.typeOf(result, "Promise");
//   });

//   test("the method getWorkerById must return a ApiResponse", async (assert) => {
//     const result = await service.getWorkerById(1);
//     assert.instanceOf(result, ApiResponse);
//   });

//   test("the method getWorkerById must return a OK code ", async (assert) => {
//     const result = await service.getWorkerById(1);
//     assert.isTrue(result.operation.code === EResponseCodes.OK);
//   });

//   test("the method getWorkerById must return a array", async (assert) => {
//     const result = await service.getWorkerById(1);

//     assert.isArray(result.data);
//   });
// });
