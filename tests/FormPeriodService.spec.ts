import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import FormPeriodService from "App/Services/FormPeriodService";
import FormPeriodRepository from "App/Repositories/FormsPeriodRepository";
import {
  IFormPeriod,
  IFormPeriodFilters,
} from "App/Interfaces/FormPeriodInterface";
import { DateTime } from "luxon";
import { TypesContractsRepositoryFake } from "./FakeClass/TypesContractsRepositoryFake";

const service = new FormPeriodService(
  new FormPeriodRepository(),
  new TypesContractsRepositoryFake()
);

test.group("FormPeriodService TEST for createManualDeduction", () => {
  const formPeriod: IFormPeriod = {
    idFormType: 2,
    state: "Generada",
    dateStart: DateTime.fromISO("2023-09-01T00:00:00.000-00:00"),
    dateEnd: DateTime.fromISO("2023-09-30T00:00:00.000-00:00"),
    paidDate: DateTime.fromISO("2023-10-05T00:00:00.000-00:00"),
    month: 9,
    year: 2023,
    observation: "test",
  };

  test("class service must have a method createFormPeriod with a return", async (assert) => {
    const result = await service.createFormPeriod(formPeriod);
    assert.isNotNull(result);
  });

  test("the method createFormPeriod must be a promise", async (assert) => {
    const result = await service.createFormPeriod(formPeriod);
    console.log(typeof result);
    assert.typeOf(result, "Object");
  });

  test("the method createFormPeriod must return a ApiResponse", async (assert) => {
    const result = await service.createFormPeriod(formPeriod);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method createFormPeriod must return a OK code ", async (assert) => {
    const result = await service.createFormPeriod(formPeriod);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("FormPeriodService TEST for getDeductionTypes", () => {
  test("class service must have a method getDeductionTypes with a return", async (assert) => {
    const result = await service.getFormTypes();
    assert.isNotNull(result);
  });

  test("the method getDeductionTypes must be a object", async (assert) => {
    const result = await service.getFormTypes();
    assert.typeOf(result, "object");
  });

  test("the method getDeductionTypes must return a ApiResponse", async (assert) => {
    const result = await service.getFormTypes();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getDeductionTypes must return a OK code ", async (assert) => {
    const result = await service.getFormTypes();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("FormPeriodService  TEST for getFormPeriodById", () => {
  test("class service must have a method getFormPeriodById with a return", async (assert) => {
    const result = await service.getFormPeriodById(1);
    assert.isNotNull(result);
  });

  test("the method getFormPeriodById must be a promise", async (assert) => {
    const result = service.getFormPeriodById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getFormPeriodById must return a ApiResponse", async (assert) => {
    const result = await service.getFormPeriodById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getFormPeriodById must return a OK code ", async (assert) => {
    const result = await service.getFormPeriodById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("FormPeriodService  TEST for getLastPeriods", () => {
  test("class service must have a method getLastPeriods with a return", async (assert) => {
    const result = await service.getLastPeriods(1);
    assert.isNotNull(result);
  });

  test("the method getLastPeriods must be a promise", async (assert) => {
    const result = await service.getLastPeriods(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getLastPeriods must return a ApiResponse", async (assert) => {
    const result = await service.getLastPeriods(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getLastPeriods must return a OK code ", async (assert) => {
    const result = await service.getLastPeriods(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("FormPeriodService  TEST for getFormsPeriodPaginate", () => {
  const filters: IFormPeriodFilters = {
    idFormType: 1,
    state: "Generada",
    paidDate: DateTime.fromISO("2023-10-05T00:00:00.000-00:00"),
    page: 1,
    perPage: 10,
  };

  test("class service must have a method getFormsPeriodPaginate with a return", async (assert) => {
    const result = await service.getFormsPeriodPaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getFormsPeriodPaginate must be a promise", async (assert) => {
    const result = service.getFormsPeriodPaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getFormsPeriodPaginate must return a ApiResponse", async (assert) => {
    const result = await service.getFormsPeriodPaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getFormsPeriodPaginate must return a OK code ", async (assert) => {
    const result = await service.getFormsPeriodPaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});
