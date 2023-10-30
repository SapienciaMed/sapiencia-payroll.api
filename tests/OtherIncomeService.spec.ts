import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import OtherIncomeService from "App/Services/OtherIncomeService";
import { OtherIncomeRepositoryFake } from "./FakeClass/OtherIncomeRepositoryFake";
import { ApiResponse } from "App/Utils/ApiResponses";
import {
  IOtherIncome,
  IFilterOtherIncome,
} from "App/Interfaces/OtherIncomeInterfaces";

const service = new OtherIncomeService(new OtherIncomeRepositoryFake());

test.group("OtherIncomeService TEST for createOtherIncome", () => {
  const otherIncomeFake: IOtherIncome = {
    // id: 1,
    codEmployment: 11,
    codPayroll: 1,
    codTypeIncome: 17,
    state: "Pendiente",
    value: 15000000.0,
  };

  test("class service must have a method createOtherIncome with a return", async (assert) => {
    const result = await service.createOtherIncome(otherIncomeFake);
    assert.isNotNull(result);
  });

  test("the method createOtherIncome must be a promise", async (assert) => {
    const result = await service.createOtherIncome(otherIncomeFake);
    console.log(typeof result);
    assert.typeOf(result, "Object");
  });

  test("the method createOtherIncome must return a ApiResponse", async (assert) => {
    const result = await service.createOtherIncome(otherIncomeFake);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method createOtherIncome must return a OK code ", async (assert) => {
    const result = await service.createOtherIncome(otherIncomeFake);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("OtherIncomeService TEST for updateOtherIncome", () => {
  const otherIncomeFake: IOtherIncome = {
    id: 1,
    codEmployment: 11,
    codPayroll: 1,
    codTypeIncome: 17,
    state: "Finalizado",
    value: 15000000.0,
  };

  test("class service must have a method updateOtherIncome with a return", async (assert) => {
    const result = await service.updateOtherIncome(otherIncomeFake);
    assert.isNotNull(result);
  });

  test("the method updateOtherIncome must be a promise", async (assert) => {
    const result = await service.updateOtherIncome(otherIncomeFake);
    console.log(typeof result);
    assert.typeOf(result, "Object");
  });

  test("the method updateOtherIncome must return a ApiResponse", async (assert) => {
    const result = await service.updateOtherIncome(otherIncomeFake);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method updateOtherIncome must return a OK code ", async (assert) => {
    const result = await service.updateOtherIncome(otherIncomeFake);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("OtherIncomeService  TEST for getOtherIncomeById", () => {
  test("class service must have a method getOtherIncomeById with a return", async (assert) => {
    const result = await service.getOtherIncomeById(1);
    assert.isNotNull(result);
  });

  test("the method getOtherIncomeById must be a promise", async (assert) => {
    const result = service.getOtherIncomeById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getOtherIncomeById must return a ApiResponse", async (assert) => {
    const result = await service.getOtherIncomeById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getOtherIncomeById must return a OK code ", async (assert) => {
    const result = await service.getOtherIncomeById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("OtherIncomeService  TEST for getOtherIncomePaginate", () => {
  const filters: IFilterOtherIncome = {
    codEmployment: 1,
    codPayroll: 1,
    page: 1,
    perPage: 10,
  };

  test("class service must have a method getOtherIncomePaginate with a return", async (assert) => {
    const result = await service.getOtherIncomePaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getOtherIncomePaginate must be a promise", async (assert) => {
    const result = service.getOtherIncomePaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getOtherIncomePaginate must return a ApiResponse", async (assert) => {
    const result = await service.getOtherIncomePaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getOtherIncomePaginate must return a OK code ", async (assert) => {
    const result = await service.getOtherIncomePaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});
