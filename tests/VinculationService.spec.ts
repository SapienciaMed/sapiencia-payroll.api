import test from "japa";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { WorkerRepositoryFake } from "./FakeClass/WorkerRepositoryFake";
import { ApiResponse } from "App/Utils/ApiResponses";
import VinculationService from "App/Services/VinculationService";
import { EmploymentRepositoryFake } from "./FakeClass/EmploymentRepositoryFake";
import { RelativeRepositoryFake } from "./FakeClass/RelativeRepositoryFake";
import { TypesContractsRepositoryFake } from "./FakeClass/TypesContractsRepositoryFake";
import { ChargesRepositoryFake } from "./FakeClass/ChargesRepositoryFake";
import { ICreateOrUpdateVinculation } from "App/Interfaces/VinculationInterfaces";
import { DateTime } from "luxon";
import Database from "@ioc:Adonis/Lucid/Database";
import { ContractSuspensionRepositoryFake } from "./FakeClass/ContractSuspensionFake";
import { SalaryHistoryRepositoryFake } from "./FakeClass/SalaryHistoryRepositoryFake";
import { SalaryIncrementRepositoryFake } from "./FakeClass/SalaryIncrementRepositoryFake";
import {
  IFilterContractSuspension,
  IcontractSuspension,
} from "App/Interfaces/ContractSuspensionInterfaces";

const service = new VinculationService(
  new WorkerRepositoryFake(),
  new RelativeRepositoryFake(),
  new EmploymentRepositoryFake(),
  new TypesContractsRepositoryFake(),
  new ChargesRepositoryFake(),
  new ContractSuspensionRepositoryFake(),
  new SalaryHistoryRepositoryFake(),
  new SalaryIncrementRepositoryFake()
);

test.group("VinculationService TEST for createVinculation", () => {
  const vinculation: ICreateOrUpdateVinculation = {
    worker: {
      typeDocument: "CC",
      numberDocument: "123456789",
      firstName: "Juan",
      secondName: "",
      surname: "Andrade",
      secondSurname: "",
      gender: "M",
      bloodType: "1",
      birthDate: DateTime.now(),
      nationality: "COL",
      email: "",
      contactNumber: "3006847693",
      department: "5",
      municipality: "1",
      neighborhood: "17",
      address: "CLL 98 A57 #58",
      socioEconomic: "3",
      eps: "2",
      severanceFund: "",
      arl: "",
      riskLevel: "",
      housingType: "",
      fundPension: "",
      userCreate: "",
      userModified: "",
    },
    relatives: [
      {
        workerId: 2,
        name: "Alfonso Andres",
        birthDate: DateTime.now(),
        gender: "F",
        relationship: "2",
      },
    ],
    employment: {
      workerId: 2,
      idCharge: 2,
      institutionalMail: "jhondoe@gmail.com",
      contractNumber: "378578483",
      startDate: DateTime.now(),
      state: "1",
      idTypeContract: 3,
      observation: "",
      salary: 234345,
      totalValue: 400000,
    },
  };

  test("class service must have a method createVinculation with a return", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createVinculation(vinculation, trx);
      assert.isNotNull(result);
    });
  });

  test("the method createVinculation must be a promise", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = service.createVinculation(vinculation, trx);
      assert.typeOf(result, "Promise");
    });
  });

  test("the method createVinculation must return a ApiResponse", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createVinculation(vinculation, trx);
      assert.instanceOf(result, ApiResponse);
    });
  });

  test("the method createVinculation must return a OK code ", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createVinculation(vinculation, trx);
      assert.isTrue(result.operation.code === EResponseCodes.OK);
    });
  });
});

test.group("VinculationService TEST for editVinculation", () => {
  const vinculation: ICreateOrUpdateVinculation = {
    worker: {
      typeDocument: "CC",
      numberDocument: "123456789",
      firstName: "Juan",
      secondName: "",
      surname: "Andrade",
      secondSurname: "",
      gender: "M",
      bloodType: "1",
      birthDate: DateTime.now(),
      nationality: "COL",
      email: "",
      contactNumber: "3006847693",
      department: "5",
      municipality: "1",
      neighborhood: "17",
      address: "CLL 98 A57 #58",
      socioEconomic: "3",
      eps: "2",
      severanceFund: "",
      arl: "",
      riskLevel: "",
      housingType: "",
      fundPension: "",
      userCreate: "",
      userModified: "",
    },
    relatives: [
      {
        workerId: 2,
        name: "Alfonso Andres",
        birthDate: DateTime.now(),
        gender: "F",
        relationship: "2",
      },
    ],
    employment: {
      workerId: 2,
      idCharge: 2,
      institutionalMail: "jhondoe@gmail.com",
      contractNumber: "378578483",
      startDate: DateTime.now(),
      state: "1",
      idTypeContract: 3,
      observation: "",
      salary: 234345,
      totalValue: 400000,
    },
  };

  test("class service must have a method editVinculation with a return", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.editVinculation(vinculation, trx);
      assert.isNotNull(result);
    });
  });

  test("the method editVinculation must be a promise", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = service.createVinculation(vinculation, trx);
      assert.typeOf(result, "Promise");
    });
  });

  test("the method editVinculation must return a ApiResponse", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createVinculation(vinculation, trx);
      assert.instanceOf(result, ApiResponse);
    });
  });

  test("the method editVinculation must return a OK code ", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createVinculation(vinculation, trx);
      assert.isTrue(result.operation.code === EResponseCodes.OK);
    });
  });
});

test.group("VinculationService TEST for getVinculationById", () => {
  test("class service must have a method getVinculationById with a return", async (assert) => {
    const result = await service.getVinculationById(1);
    assert.isNotNull(result);
  });

  test("the method getVinculationById must be a promise", async (assert) => {
    const result = service.getVinculationById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method editVinculation must return a ApiResponse", async (assert) => {
    const result = await service.getVinculationById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method editVinculation must return a OK code ", async (assert) => {
    const result = await service.getVinculationById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getVinculationPaginate", () => {
  const filters = {
    page: 1,
    perPage: 2,
  };

  test("class service must have a method getVinculationPaginate with a return", async (assert) => {
    const result = await service.getVinculationPaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getVinculationPaginate must be a promise", async (assert) => {
    const result = service.getVinculationPaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getVinculationPaginate must return a ApiResponse", async (assert) => {
    const result = await service.getVinculationPaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getVinculationPaginate must return a OK code ", async (assert) => {
    const result = await service.getVinculationPaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getChargesList", () => {
  test("class service must have a method getChargesList with a return", async (assert) => {
    const result = await service.getChargesList();
    assert.isNotNull(result);
  });

  test("the method getChargesList must be a promise", async (assert) => {
    const result = service.getChargesList();
    assert.typeOf(result, "Promise");
  });

  test("the method getChargesList must return a ApiResponse", async (assert) => {
    const result = await service.getChargesList();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getChargesList must return a OK code ", async (assert) => {
    const result = await service.getChargesList();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getChargeById", () => {
  test("class service must have a method getChargeById with a return", async (assert) => {
    const result = await service.getChargeById(1);
    assert.isNotNull(result);
  });

  test("the method getChargeById must be a promise", async (assert) => {
    const result = service.getChargeById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getChargeById must return a ApiResponse", async (assert) => {
    const result = await service.getChargeById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getChargeById must return a OK code ", async (assert) => {
    const result = await service.getChargeById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getTypesContractsList", () => {
  test("class service must have a method getTypesContractsList with a return", async (assert) => {
    const result = await service.getTypesContractsList();
    assert.isNotNull(result);
  });

  test("the method getTypesContractsList must be a promise", async (assert) => {
    const result = service.getTypesContractsList();
    assert.typeOf(result, "Promise");
  });

  test("the method getTypesContractsList must return a ApiResponse", async (assert) => {
    const result = await service.getTypesContractsList();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getTypesContractsList must return a OK code ", async (assert) => {
    const result = await service.getTypesContractsList();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getTypeContractsById", () => {
  test("class service must have a method getTypeContractsById with a return", async (assert) => {
    const result = await service.getTypeContractsById(1);
    assert.isNotNull(result);
  });

  test("the method getTypeContractsById must be a promise", async (assert) => {
    const result = service.getTypeContractsById(1);
    assert.typeOf(result, "Promise");
  });

  test("the method getTypeContractsById must return a ApiResponse", async (assert) => {
    const result = await service.getTypeContractsById(1);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getTypeContractsById must return a OK code ", async (assert) => {
    const result = await service.getTypeContractsById(1);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getEmploymentPaginate", () => {
  const filters = {
    page: 1,
    perPage: 2,
    workerId: 1,
  };

  test("class service must have a method getEmploymentPaginate with a return", async (assert) => {
    const result = await service.getEmploymentPaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getEmploymentPaginate must be a promise", async (assert) => {
    const result = service.getEmploymentPaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getEmploymentPaginate must return a ApiResponse", async (assert) => {
    const result = await service.getEmploymentPaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getEmploymentPaginate must return a OK code ", async (assert) => {
    const result = await service.getEmploymentPaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for getContractSuspensionPaginate", () => {
  const filters: IFilterContractSuspension = {
    page: 1,
    perPage: 2,
    codEmployment: 1,
  };

  test("class service must have a method getContractSuspensionPaginate with a return", async (assert) => {
    const result = await service.getContractSuspensionPaginate(filters);
    assert.isNotNull(result);
  });

  test("the method getContractSuspensionPaginate must be a promise", async (assert) => {
    const result = service.getContractSuspensionPaginate(filters);
    assert.typeOf(result, "Promise");
  });

  test("the method getContractSuspensionPaginate must return a ApiResponse", async (assert) => {
    const result = await service.getContractSuspensionPaginate(filters);
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getContractSuspensionPaginate must return a OK code ", async (assert) => {
    const result = await service.getContractSuspensionPaginate(filters);
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});

test.group("VinculationService TEST for createContractSuspension", () => {
  const suspension: IcontractSuspension = {
    codEmployment: 17,
    dateStart: DateTime.fromISO("2023-08-31T00:00:00.000-05:00"),
    dateEnd: DateTime.fromISO("2023-09-15T00:00:00.000-05:00"),
    adjustEndDate: false,
    newDateEnd: DateTime.fromISO("2023-09-16T00:00:00.000-05:00"),
    observation: "test",
    dateModified: DateTime.fromISO("2023-09-01T12:08:37.904-05:00"),
    dateCreate: DateTime.fromISO("2023-09-01T12:08:37.904-05:00"),
    id: 6,
  };

  test("class service must have a method createContractSuspension with a return", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createContractSuspension(suspension, trx);
      assert.isNotNull(result);
    });
  });

  test("the method createContractSuspension must be a promise", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = service.createContractSuspension(suspension, trx);
      assert.typeOf(result, "Promise");
    });
  });

  test("the method createContractSuspension must return a ApiResponse", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createContractSuspension(suspension, trx);
      assert.instanceOf(result, ApiResponse);
    });
  });

  test("the method createContractSuspension must return a OK code ", async (assert) => {
    await Database.transaction(async (trx) => {
      const result = await service.createContractSuspension(suspension, trx);
      assert.isTrue(result.operation.code === EResponseCodes.OK);
    });
  });
});

test.group("VinculationService TEST for getActivesContractorworkers", () => {
  test("class service must have a method getActivesContractorworkers with a return", async (assert) => {
    const result = await service.getActivesContractorworkers();
    assert.isNotNull(result);
  });

  test("the method getActivesContractorworkers must be a promise", async (assert) => {
    const result = await service.getActivesContractorworkers();
    assert.typeOf(result, "Promise");
  });

  test("the method getActivesContractorworkers must return a ApiResponse", async (assert) => {
    const result = await service.getActivesContractorworkers();
    assert.instanceOf(result, ApiResponse);
  });

  test("the method getActivesContractorworkers must return a OK code ", async (assert) => {
    const result = await service.getActivesContractorworkers();
    assert.isTrue(result.operation.code === EResponseCodes.OK);
  });
});
