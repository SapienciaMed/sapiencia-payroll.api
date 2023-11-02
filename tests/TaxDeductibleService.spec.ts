import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { TaxDeductibleRepositoryFake } from "./FakeClass/TaxDeductibleRepositoryFake";
import TaxDeductibleService from "App/Services/TaxDeductibleService";
import { ApiResponse } from "App/Utils/ApiResponses";
import {
  ITaxDeductible,
  IFilterTaxDeductible,
} from "App/Interfaces/TaxDeductibleInterfaces";

const service = new TaxDeductibleService(new TaxDeductibleRepositoryFake());

test.group("TaxDeductibleService TEST for createTaxDeductible", () => {
  const taxDeductibleFake: ITaxDeductible = {
    // id: 1,
    codEmployment: 11,
    type: "D01",
    year: 2023,
    state: "Pendiente",
    value: 15000000.0,
  };

  test("class service must have a method createTaxDeductible with a return", async (assert) => {
    const result = await service.createTaxDeductible(taxDeductibleFake);
    assert.isNotNull(result);
  });

  test("the method createTaxDeductible must be a promise", async (assert) => {
    const result = await service.createTaxDeductible(taxDeductibleFake);
    assert.typeOf(result, "Object");
  });

  test("the method createTaxDeductible must return a ApiResponse", async (assert) => {
    const result = await service.createTaxDeductible(taxDeductibleFake);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method createTaxDeductible must return a OK code ", async (assert) => {
    const result = await service.createTaxDeductible(taxDeductibleFake);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("TaxDeductibleService TEST for updateTaxDeductible", () => {
  const taxDeductibleFake: ITaxDeductible = {
    id: 1,
    codEmployment: 11,
    type: "D01",
    year: 2023,
    state: "Finalizado",
    value: 15000000.0,
  };
  test("class service must have a method updateOtherIncome with a return", async (assert) => {
    const result = await service.updateTaxDeductible(taxDeductibleFake);
    assert.isNotNull(result);
  });

  test("the method updateOtherIncome must be a promise", async (assert) => {
    const result = await service.updateTaxDeductible(taxDeductibleFake);
    console.log(typeof result);
    assert.typeOf(result, "Object");
  });

  test("the method updateOtherIncome must return a ApiResponse", async (assert) => {
    const result = await service.updateTaxDeductible(taxDeductibleFake);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method updateOtherIncome must return a OK code ", async (assert) => {
    const result = await service.updateTaxDeductible(taxDeductibleFake);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("TaxDeductibleService  TEST for getTaxDeductibleById", () => {
  test("class service must have a method getTaxDeductibleById with a return", async (assert) => {
    const result = await service.getTaxDeductibleById(1);
    assert.isNotNull(result);
  });

  test("the method getTaxDeductibleById must be a promise", async (assert) => {
    const result = service.getTaxDeductibleById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getTaxDeductibleById must return a ApiResponse", async (assert) => {
    const result = await service.getTaxDeductibleById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getTaxDeductibleById must return a OK code ", async (assert) => {
    const result = await service.getTaxDeductibleById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("TaxDeductibleService  TEST for getTaxDeductiblePaginate", () => {
  const filters: IFilterTaxDeductible = {
    codEmployment: 1,
    year: 2023,
    page: 1,
    perPage: 10,
  };

  test("class service must have a method getTaxDeductiblePaginate with a return", async (assert) => {
    const result = await service.getTaxDeductiblePaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getTaxDeductiblePaginate must be a promise", async (assert) => {
    const result = service.getTaxDeductiblePaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getTaxDeductiblePaginate must return a ApiResponse", async (assert) => {
    const result = await service.getTaxDeductiblePaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getTaxDeductiblePaginate must return a OK code ", async (assert) => {
    const result = await service.getTaxDeductiblePaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});
