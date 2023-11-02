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
  const licenceFake: ILicence[] = [{
    id: 1,
    codEmployment: 1,
    dateStart: DateTime.fromFormat("01/08/2023", "dd/MM/yyyy"), 
    dateEnd: DateTime.fromFormat("01/08/2023", "dd/MM/yyyy"), 
    idLicenceType: 1,
    licenceState: "En progreso",
    resolutionNumber: "12345 de julio",
    observation: "test",
  },{
    id: 2,
    codEmployment: 2,
    dateStart: DateTime.fromFormat("01/09/2023", "dd/MM/yyyy"), 
    dateEnd: DateTime.fromFormat("01/09/2023", "dd/MM/yyyy"), 
    idLicenceType: 1,
    licenceState: "En progreso",
    resolutionNumber: "12345 de julio",
    observation: "test",
  }];

  test("class service must have a method createLicence with a return", async (assert) => {
    const result = await service.createLicence(licenceFake[0]);
    assert.isNotNull(result);
  });

  test("the method createLicence must be a promise", async (assert) => {
    const result = await service.createLicence(licenceFake[0]);
    console.log(typeof(result))
    assert.typeOf(result, "Object");
  });

  test("the method createLicence must return a ApiResponse", async (assert) => {
    const result = await service.createLicence(licenceFake[0]);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method createLicence must return a OK code ", async (assert) => {
    const result = await service.createLicence(licenceFake[1]);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("LicenceService TEST for getLicenceTypes", () => {

  test("class service must have a method getLicenceTypes with a return", async (assert) => {
    const result = await service.getLicenceTypes();
    assert.isNotNull(result);
  });

  test("the method getLicenceTypes must be a object", async (assert) => {
    const result = await service.getLicenceTypes();
    assert.typeOf(result, "object");
  });

  test("the method getLicenceTypes must return a ApiResponse", async (assert) => {
    const result = await service.getLicenceTypes();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getLicenceTypes must return a OK code ", async (assert) => {
    const result = await service.getLicenceTypes();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("LicenceService  TEST for getLicenceById", () => {


  test("class service must have a method getLicenceById with a return", async (assert) => {
    const result = await service.getLicenceById(1);
    assert.isNotNull(result);
  });

  test("the method getLicenceById must be a promise", async (assert) => {
    const result = service.getLicenceById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getLicenceById must return a ApiResponse", async (assert) => {
    const result = await service.getLicenceById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getLicenceById must return a OK code ", async (assert) => {
    const result = await service.getLicenceById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("LicenceService  TEST for getLicencePaginate", () => {
  const filters: ILicenceFilters = {
    codEmployment: 1,
    idLicenceType: 1,
    licenceState:"En progreso",
    page: 1,
    perPage: 10,
  };

  test("class service must have a method getLicencePaginate with a return", async (assert) => {
    const result = await service.getLicencePaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getLicencePaginate must be a promise", async (assert) => {
    const result = service.getLicencePaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getLicencePaginate must return a ApiResponse", async (assert) => {
    const result = await service.getLicencePaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getLicencePaginate must return a OK code ", async (assert) => {
    const result = await service.getLicencePaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});
