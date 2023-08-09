import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import Database from "@ioc:Adonis/Lucid/Database";
import { VacationDaysRepositoryFake } from "./FakeClass/VacationDaysRepository";
import VacationService from "App/Services/VacationService";
import { VacationRepositoryFake } from "./FakeClass/VacationRepositoryFake";
import {
  IEditVacation,
  IVacationDayValidator,
} from "App/Interfaces/VacationDaysInterface";
import {
  IVacationFilters,
  IVacationSearchParams,
} from "App/Interfaces/VacationsInterfaces";

const service = new VacationService(
  new VacationRepositoryFake(),
  new VacationDaysRepositoryFake()
);

test.group("VacationService TEST for createVacationEnjoyed", () => {
  const vacation: IVacationDayValidator = {
    vacationDay: [
      {
        id: 1,
        codVacation: 1,
        dateFrom: DateTime.fromISO("02/08/2023"),
        dateUntil: DateTime.fromISO("02/16/2023"),
        enjoyedDays: 5,
        paid: false,
        codForm: 1,
        observation: "test",
      },
      {
        id: 2,
        codVacation: 1,
        dateFrom: DateTime.fromISO("02/08/2023"),
        enjoyedDays: 2,
        paid: true,
        codForm: 1,
        observation: "test",
      },
    ],
    enjoyedDays: 10,
    avaibleDays: 5,
    formedDays:1,
    periodId:1,
    refundDays:2,
  };

  test("class service must have a method createManyVacation with a return", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createManyVacation(vacation, trx);
      assert.isNotNull(result);
    });
  });

  test("the method createManyVacation must be a promise", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = service.createManyVacation(vacation, trx);
      assert.typeOf(result, "Promise");
    });
  });

  test("the method createManyVacation must return a ApiResponse", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createManyVacation(vacation, trx);
      assert.instanceOf(result, ApiResponse);
    });
  });

  test("the method createManyVacation must return a OK code ", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createManyVacation(vacation, trx);
      assert.isTrue(result.operation.code === EResponseCodes.OK);
    });
  });
});

test.group("VacationService TEST for updateVacation", () => {
  const vacationDay: IEditVacation = {
    id: 1,
    idVacationDay: 1,
    dateFrom: DateTime.fromISO("02/08/2023"),
    dateUntil: DateTime.fromISO("02/16/2023"),
    observation: "test",
    available: 10,
    refundTypes: "General",
    refund: 2,
    enjoyed: 5,
  };

  test("class service must have a method updateVacation with a return", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.updateVacation(vacationDay, trx);
      assert.isNotNull(result);
    });
  });

  test("the method updateVacation must be a promise", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = service.updateVacation(vacationDay, trx);
      assert.typeOf(result, "Promise");
    });
  });

  test("the method updateVacation must return a ApiResponse", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.updateVacation(vacationDay, trx);
      assert.instanceOf(result, ApiResponse);
    });
  });

  test("the method updateVacation must return a OK code ", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.updateVacation(vacationDay, trx);
      assert.isTrue(result.operation.code === EResponseCodes.OK);
    });
  });
});

test.group("VinculationService TEST for getVacationsByParams", () => {
  const vacationDay: IVacationSearchParams = {
    workerId: 1,
    period: 2023,
  };

  test("class service must have a method getVacationsByParams with a return", async (assert) => {
    const result = await service.getVacationsByParams(vacationDay);
    assert.isNotNull(result);
  });

  test("the method getVacationsByParams must be a promise", async (assert) => {
    const result = service.getVacationsByParams(vacationDay);
    assert.typeOf(result, "Promise");
  });

  test("the method getVacationsByParams must return a ApiResponse", async (assert) => {
    const result = await service.getVacationsByParams(vacationDay);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getVacationsByParams must return a OK code ", async (assert) => {
    const result = await service.getVacationsByParams(vacationDay);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getVinculationPaginate", () => {
  const filters: IVacationFilters = {
    workerId: 1,
    period: 2023,
    page: 1,
    perPage: 10,
  };

  test("class service must have a method getVinculationPaginate with a return", async (assert) => {
    const result = await service.getVacationPaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getVinculationPaginate must be a promise", async (assert) => {
    const result = service.getVacationPaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getVinculationPaginate must return a ApiResponse", async (assert) => {
    const result = await service.getVacationPaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getVinculationPaginate must return a OK code ", async (assert) => {
    const result = await service.getVacationPaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});