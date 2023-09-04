import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import { DateTime } from "luxon";
import { IncapacityRepositoryFake } from "./FakeClass/IncapacityRepositoryFake";
import IncapacityService from "App/Services/IncapacityService";
import { IncapacityTypesRepositoryFake } from "./FakeClass/IncapacityTypesRepositoryFake";
import { IFilterIncapacity, IIncapacity } from "App/Interfaces/IncapacityInterfaces";

const service = new IncapacityService(
  new IncapacityRepositoryFake(),
  new IncapacityTypesRepositoryFake()
);

test.group("IncapacityService TEST for createIncapacity", () => {
  const IncapacityFake: IIncapacity[] = [
    {
      userCreate: "test",
      id: 9,
      codIncapacityType: 2,
      codEmployment: 2,
      dateInitial: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
      dateFinish: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
      comments: "smoke test QA 14 08 2023",
      isExtension: false,
      userModified: "test",
      dateModified: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
      dateCreate: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
    },
    {
      userCreate: "test",
      id: 9,
      codIncapacityType: 2,
      codEmployment: 2,
      dateInitial: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
      dateFinish: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
      comments: "smoke test QA 14 08 2023",
      isExtension: false,
      userModified: "test",
      dateModified: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
      dateCreate: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
    },
  ];

  test("class service must have a method createIncapacity with a return", async (assert) => {
    const result = await service.createIncapacity(IncapacityFake[0]);
    assert.isNotNull(result);
  });

  test("the method createIncapacity must be a promise", async (assert) => {
    const result = await service.createIncapacity(IncapacityFake[0]);
    console.log(typeof result);
    assert.typeOf(result, "Object");
  });

  test("the method createIncapacity must return a ApiResponse", async (assert) => {
    const result = await service.createIncapacity(IncapacityFake[0]);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method createIncapacity must return a OK code ", async (assert) => {
    const result = await service.createIncapacity(IncapacityFake[0]);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("IncapacityService TEST for updateIncapacity", () => {
    const IncapacityFake: IIncapacity[] = [
      {
        userCreate: "test",
        id: 9,
        codIncapacityType: 2,
        codEmployment: 2,
        dateInitial: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
        dateFinish: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
        comments: "smoke test QA 14 08 2023",
        isExtension: false,
        userModified: "test",
        dateModified: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
        dateCreate: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
      },
      {
        userCreate: "test",
        id: 9,
        codIncapacityType: 2,
        codEmployment: 2,
        dateInitial: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
        dateFinish: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
        comments: "smoke test QA 14 08 2023",
        isExtension: false,
        userModified: "test",
        dateModified: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
        dateCreate: DateTime.fromFormat("02/16/2023", "dd/MM/yyyy"),
      },
    ];
  
    test("class service must have a method updateIncapacity with a return", async (assert) => {
      const result = await service.updateIncapacity(IncapacityFake[0],1);
      assert.isNotNull(result);
    });
  
    test("the method updateIncapacity must be a promise", async (assert) => {
      const result = await service.updateIncapacity(IncapacityFake[0],1);
      console.log(typeof result);
      assert.typeOf(result, "Object");
    });
  
    test("the method updateIncapacity must return a ApiResponse", async (assert) => {
      const result = await service.updateIncapacity(IncapacityFake[0],1);
      assert.instanceOf(result, ApiResponse);
    });
  
    test("the method updateIncapacity must return a OK code ", async (assert) => {
      const result = await service.updateIncapacity(IncapacityFake[0],1);
      assert.isTrue(result.operation.code === EResponseCodes.OK);
    });
  });

test.group("IncapacityService TEST for getIncapacityTypes", () => {
  test("class service must have a method getIncapacityTypes with a return", async (assert) => {
    const result = await service.getIncapacityTypes();
    assert.isNotNull(result);
  });

  test("the method getIncapacityTypes must be a object", async (assert) => {
    const result = await service.getIncapacityTypes();
    assert.typeOf(result, "object");
  });

  test("the method getIncapacityTypes must return a ApiResponse", async (assert) => {
    const result = await service.getIncapacityTypes();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getIncapacityTypes must return a OK code ", async (assert) => {
    const result = await service.getIncapacityTypes();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("IncapacityService  TEST for getIncapacityById", () => {
  test("class service must have a method getIncapacityById with a return", async (assert) => {
    const result = await service.getIncapacityById(1);
    assert.isNotNull(result);
  });

  test("the method getIncapacityById must be a promise", async (assert) => {
    const result = service.getIncapacityById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getIncapacityById must return a ApiResponse", async (assert) => {
    const result = await service.getIncapacityById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getIncapacityById must return a OK code ", async (assert) => {
    const result = await service.getIncapacityById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("IncapacityService  TEST for getIncapacityPaginate", () => {
  const filters: IFilterIncapacity = {
    workerId: 1,
    page: 1,
    perPage: 10,
  };

  test("class service must have a method getIncapacityPaginate with a return", async (assert) => {
    const result = await service.getIncapacityPaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getIncapacityPaginate must be a promise", async (assert) => {
    const result = service.getIncapacityPaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getIncapacityPaginate must return a ApiResponse", async (assert) => {
    const result = await service.getIncapacityPaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getIncapacityPaginate must return a OK code ", async (assert) => {
    const result = await service.getIncapacityPaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});
