import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import { VacationDaysRepositoryFake } from "./FakeClass/VacationDaysRepository";
import LicenceService from "App/Services/LicenceService";
import { LicenceRepositoryFake } from "./FakeClass/LicenceRepositoryFake";
import { IncapacityRepositoryFake } from "./FakeClass/IncapacityRepositoryFake";
import { ILicence, ILicenceFilters } from "App/Interfaces/LicenceInterfaces";

const service = new LicenceService(
  new LicenceRepositoryFake(),
  new VacationDaysRepositoryFake(),
  new IncapacityRepositoryFake()
);

test.group("LicenceService TEST for createLicence", () => {
  const licenceFake: ILicence = {
    id: 1,
    codEmployment: 1,
    dateStart: DateTime.fromISO("01/08/2023"),
    dateEnd: DateTime.fromISO("01/08/2023"),
    idLicenceType: 1,
    licenceState: "En progreso",
    resolutionNumber: "12345 de julio",
    observation: "test",
  };

  test("class service must have a method createLicence with a return", async (assert) => {
    const result = await service.createLicence(licenceFake);
    assert.isNotNull(result);
  });

  test("the method createLicence must be a promise", async (assert) => {
    const result = await service.createLicence(licenceFake);
    assert.typeOf(result, "Promise");
  });

  test("the method createLicence must return a ApiResponse", async (assert) => {
    const result = await service.createLicence(licenceFake);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method createLicence must return a OK code ", async (assert) => {
    const result = await service.createLicence(licenceFake);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VacationService TEST for updateVacation", () => {

  test("class service must have a method updateVacation with a return", async (assert) => {
    const result = await service.getLicenceTypes();
    assert.isNotNull(result);
  });

  test("the method updateVacation must be a promise", async (assert) => {
    const result = await service.getLicenceTypes();
    assert.typeOf(result, "Promise");
  });

  test("the method updateVacation must return a ApiResponse", async (assert) => {
    const result = await service.getLicenceTypes();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method updateVacation must return a OK code ", async (assert) => {
    const result = await service.getLicenceTypes();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getVacationsByParams", () => {


  test("class service must have a method getVacationsByParams with a return", async (assert) => {
    const result = await service.getLicenceById(1);
    assert.isNotNull(result);
  });

  test("the method getVacationsByParams must be a promise", async (assert) => {
    const result = service.getLicenceById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getVacationsByParams must return a ApiResponse", async (assert) => {
    const result = await service.getLicenceById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getVacationsByParams must return a OK code ", async (assert) => {
    const result = await service.getLicenceById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getVinculationPaginate", () => {
  const filters: ILicenceFilters = {
    codEmployment: 1,
    idLicenceType: 1,
    licenceState:"En progreso",
    page: 1,
    perPage: 10,
  };

  test("class service must have a method getVinculationPaginate with a return", async (assert) => {
    const result = await service.getLicencePaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getVinculationPaginate must be a promise", async (assert) => {
    const result = service.getLicencePaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getVinculationPaginate must return a ApiResponse", async (assert) => {
    const result = await service.getLicencePaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getVinculationPaginate must return a OK code ", async (assert) => {
    const result = await service.getLicencePaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});
