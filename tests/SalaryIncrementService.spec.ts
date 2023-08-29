import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import { SalaryIncrementRepositoryFake } from "./FakeClass/SalaryIncrementRepositoryFake";
import SalaryIncrementService from "App/Services/SalaryIncrementService";
import { ChargesRepositoryFake } from "./FakeClass/ChargesRepositoryFake";
import { SalaryHistoryRepositoryFake } from "./FakeClass/SalaryHistoryRepositoryFake";
import { EmploymentRepositoryFake } from "./FakeClass/EmploymentRepositoryFake";
import {
  ISalaryEditIncrement,
  ISalaryIncrement,
  ISalaryIncrementsFilters,
} from "App/Interfaces/SalaryIncrementInterfaces";
import Database from "@ioc:Adonis/Lucid/Database";

const service = new SalaryIncrementService(
  new SalaryIncrementRepositoryFake(),
  new SalaryHistoryRepositoryFake(),
  new EmploymentRepositoryFake(),
  new ChargesRepositoryFake()
);

test.group("SalaryIncrementService TEST for createSalaryIncrement", () => {
  const salaryIncrementFake: ISalaryIncrement = {
    codCharge: 6,
    effectiveDate: DateTime.fromISO("02/08/2023"),
    numberActApproval: "123 de 25 agosto",
    porcentualIncrement: false,
    incrementValue: 2000,
    previousSalary: 0,
    newSalary: 890000,
    observation: "test",
    userModified: "12345678",
    userCreate: "12345678",
    dateModified: DateTime.fromISO("02/08/2023"),
    dateCreate: DateTime.fromISO("02/08/2023"),
  };

  test("class service must have a method createSalaryIncrement with a return", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createSalaryIncrement(
        salaryIncrementFake,
        trx
      );
      assert.isNotNull(result);
    });
  });

  test("the method createSalaryIncrement must be a promise", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createSalaryIncrement(
        salaryIncrementFake,
        trx
      );
      console.log(typeof result);
      assert.typeOf(result, "Object");
    });
  });

  test("the method createSalaryIncrement must return a ApiResponse", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createSalaryIncrement(
        salaryIncrementFake,
        trx
      );
      assert.instanceOf(result, ApiResponse);
    });
  });

  test("the method createSalaryIncrement must return a OK code ", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createSalaryIncrement(
        salaryIncrementFake,
        trx
      );
      assert.isTrue(result.operation.code === EResponseCodes.OK);
    });
  });
});

test.group("SalaryIncrementService TEST for updataSalaryIncrement", () => {
  const salaryEditIncrementFake: ISalaryEditIncrement = {
    id: 1,
    codCharge: 6,
    effectiveDate: DateTime.fromISO("02/08/2023"),
    numberActApproval: "123 de 25 agosto",
    porcentualIncrement: false,
    incrementValue: 2000,
    previousSalary: 0,
    newSalary: 890000,
    observation: "test",
    userModified: "12345678",
    userCreate: "12345678",
    dateModified: DateTime.fromISO("02/08/2023"),
    dateCreate: DateTime.fromISO("02/08/2023"),
  };
  test("class service must have a method getLicenceTypes with a return", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.updataSalaryIncrement(
        salaryEditIncrementFake,
        trx
      );
      assert.isNotNull(result);
    });
  });

  test("the method updataSalaryIncrement must be a object", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.updataSalaryIncrement(
        salaryEditIncrementFake,
        trx
      );
      assert.typeOf(result, "object");
    });
  });

  test("the method updataSalaryIncrement must return a ApiResponse", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.updataSalaryIncrement(
        salaryEditIncrementFake,
        trx
      );
      assert.instanceOf(result, ApiResponse);
    });
  });

  test("the method updataSalaryIncrement must return a OK code ", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.updataSalaryIncrement(
        salaryEditIncrementFake,
        trx
      );
      assert.isTrue(result.operation.code === EResponseCodes.OK);
    });
  });
});

test.group("SalaryIncrementService  TEST for getSalaryIncrementById", () => {
  test("class service must have a method getLicenceById with a return", async (assert) => {
    const result = await service.getSalaryIncrementById(1);
    assert.isNotNull(result);
  });

  test("the method getSalaryIncrementById must be a promise", async (assert) => {
    const result = service.getSalaryIncrementById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getSalaryIncrementById must return a ApiResponse", async (assert) => {
    const result = await service.getSalaryIncrementById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getSalaryIncrementById must return a OK code ", async (assert) => {
    const result = await service.getSalaryIncrementById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("SalaryIncrementService  TEST for getLicencePaginate", () => {
  const filters: ISalaryIncrementsFilters = {
    codCharge: 1,
    numberActApproval: "123 de 25 agosto",
    page: 1,
    perPage: 10,
  };

  test("class service must have a method getSalaryHistoriesPaginate with a return", async (assert) => {
    const result = await service.getSalaryHistoriesPaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getLicencePaginate must be a promise", async (assert) => {
    const result = service.getSalaryHistoriesPaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getLicencePaginate must return a ApiResponse", async (assert) => {
    const result = await service.getSalaryHistoriesPaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getLicencePaginate must return a OK code ", async (assert) => {
    const result = await service.getSalaryHistoriesPaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});
