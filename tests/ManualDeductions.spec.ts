import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import { ManualDeductionRepositoryFake } from "./FakeClass/ManualDeductionFake";
import ManualDeductionService from "App/Services/ManualDeductionService";
import { EmploymentRepositoryFake } from "./FakeClass/EmploymentRepositoryFake";
import { IManualDeduction, IManualDeductionFilters } from "App/Interfaces/ManualDeductionsInterfaces";

const service = new ManualDeductionService(
  new ManualDeductionRepositoryFake(),
  new EmploymentRepositoryFake()
);

test.group("ManualDeductionService TEST for createManualDeduction", () => {
  const manualDeduction: IManualDeduction = {
    codEmployment: 17,
    codDeductionType: 1,
    cyclic: true,
    numberInstallments: 5,
    applyExtraordinary: false,
    value: 5000,
    state: "Vigente",
    observation: "test",
  };

  test("class service must have a method createManualDeduction with a return", async (assert) => {
    const result = await service.createManualDeduction(manualDeduction);
    assert.isNotNull(result);
  });

  test("the method createManualDeduction must be a promise", async (assert) => {
    const result = await service.createManualDeduction(manualDeduction);
    console.log(typeof result);
    assert.typeOf(result, "Object");
  });

  test("the method createManualDeduction must return a ApiResponse", async (assert) => {
    const result = await service.createManualDeduction(manualDeduction);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method createManualDeduction must return a OK code ", async (assert) => {
    const result = await service.createManualDeduction(manualDeduction);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("ManualDeductionService TEST for updateManualDeduction", () => {
  const manualDeduction: IManualDeduction = {
    id: 1,
    codEmployment: 17,
    codDeductionType: 1,
    cyclic: true,
    numberInstallments: 5,
    applyExtraordinary: false,
    value: 5000,
    state: "Vigente",
    observation: "test",
  };

  test("class service must have a method updateManualDeduction with a return", async (assert) => {
    const result = await service.updateManualDeduction(manualDeduction, 1);
    assert.isNotNull(result);
  });

  test("the method updateManualDeduction must be a promise", async (assert) => {
    const result = await service.updateManualDeduction(manualDeduction, 1)
    console.log(typeof result);
    assert.typeOf(result, "Object");
  });

  test("the method updateManualDeduction must return a ApiResponse", async (assert) => {
    const result = await service.updateManualDeduction(manualDeduction, 1)
    assert.instanceOf(result, ApiResponse);
  });

  test("the method updateManualDeduction must return a OK code ", async (assert) => {
    const result = await service.updateManualDeduction(manualDeduction, 1)
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("ManualDeductionService TEST for getDeductionTypes", () => {
  test("class service must have a method getDeductionTypes with a return", async (assert) => {
    const result = await service.getDeductionTypes();
    assert.isNotNull(result);
  });

  test("the method getDeductionTypes must be a object", async (assert) => {
    const result = await service.getDeductionTypes();
    assert.typeOf(result, "object");
  });

  test("the method getDeductionTypes must return a ApiResponse", async (assert) => {
    const result = await service.getDeductionTypes();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getDeductionTypes must return a OK code ", async (assert) => {
    const result = await service.getDeductionTypes();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("ManualDeductionService  TEST for getManualDeductionById", () => {
  test("class service must have a method getManualDeductionById with a return", async (assert) => {
    const result = await service.getManualDeductionById(1);
    assert.isNotNull(result);
  });

  test("the method getManualDeductionById must be a promise", async (assert) => {
    const result = service.getManualDeductionById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getManualDeductionById must return a ApiResponse", async (assert) => {
    const result = await service.getManualDeductionById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getManualDeductionById must return a OK code ", async (assert) => {
    const result = await service.getManualDeductionById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("ManualDeductionService  TEST for getManualDeductionById", () => {
    test("class service must have a method getManualDeductionById with a return", async (assert) => {
      const result = await service.getDeductionTypesByType("Ciclica");
      assert.isNotNull(result);
    });
  
    test("the method getManualDeductionById must be a promise", async (assert) => {
      const result = service.getDeductionTypesByType("Ciclica");
      assert.typeOf(result, "Promise");
    });
  
    test("the method getManualDeductionById must return a ApiResponse", async (assert) => {
      const result = await service.getDeductionTypesByType("Ciclica");
      assert.instanceOf(result, ApiResponse);
    });
  
    test("the method getManualDeductionById must return a OK code ", async (assert) => {
      const result = await service.getDeductionTypesByType("Ciclica");
      assert.isTrue(result.operation.code === EResponseCodes.OK);
    });
  });

test.group("ManualDeductionService  TEST for getManualDeductionPaginate", () => {
  const filters: IManualDeductionFilters = {
    codEmployment: 1,
    codFormsPeriod: 1,
    type: "En progreso",
    page: 1,
    perPage: 10,
  };

  test("class service must have a method getManualDeductionPaginate with a return", async (assert) => {
    const result = await service.getManualDeductionPaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getManualDeductionPaginate must be a promise", async (assert) => {
    const result = service.getManualDeductionPaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getManualDeductionPaginate must return a ApiResponse", async (assert) => {
    const result = await service.getManualDeductionPaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getManualDeductionPaginate must return a OK code ", async (assert) => {
    const result = await service.getManualDeductionPaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});
